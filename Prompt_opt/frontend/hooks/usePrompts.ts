"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import * as api from "@/lib/api/prompts";
import { toErrorMessage } from "@/lib/api/client";
import type { PromptVersion } from "@/lib/types";

const byVersionDesc = (a: PromptVersion, b: PromptVersion) =>
  b.version - a.version;

/**
 * Owns the prompt-version collection.
 *
 * Mutations apply to local state first and roll back if the request fails,
 * so the grid never blanks out or forces a reload.
 */
export function usePrompts() {
  const [prompts, setPrompts] = useState<PromptVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Snapshot used to roll a failed optimistic mutation back.
  const snapshot = useRef<PromptVersion[]>([]);

  /** Fetches and commits the collection. Never sets state synchronously. */
  const fetchInto = useCallback((signal?: AbortSignal) => {
    return api
      .fetchPrompts(signal)
      .then((data) => {
        setPrompts([...data].sort(byVersionDesc));
        setError(null);
      })
      .catch((err: unknown) => {
        if (signal?.aborted) return;
        setError(toErrorMessage(err, "Could not load prompt versions."));
      })
      .finally(() => {
        if (!signal?.aborted) setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void fetchInto(controller.signal);
    return () => controller.abort();
  }, [fetchInto]);

  /** Re-fetches from an event handler, showing the loading state again. */
  const refresh = useCallback(() => {
    setIsLoading(true);
    return fetchInto();
  }, [fetchInto]);

  /** Applies an optimistic update, restoring the snapshot if `mutate` throws. */
  const withRollback = useCallback(
    async <T,>(
      applyOptimistic: (current: PromptVersion[]) => PromptVersion[],
      mutate: () => Promise<T>,
      errorMessage: string,
    ): Promise<T | null> => {
      setPrompts((current) => {
        snapshot.current = current;
        return applyOptimistic(current);
      });

      try {
        return await mutate();
      } catch (err) {
        setPrompts(snapshot.current);
        toast.error(toErrorMessage(err, errorMessage));
        return null;
      }
    },
    [],
  );

  const create = useCallback(async (prompt: string) => {
    const created = await api.createPrompt(prompt);
    setPrompts((current) => [created, ...current].sort(byVersionDesc));
    toast.success(`Version ${created.version} created`);
    return created;
  }, []);

  const activate = useCallback(
    async (id: string) => {
      const target = prompts.find((p) => p.id === id);

      const result = await withRollback(
        (current) => current.map((p) => ({ ...p, isActive: p.id === id })),
        () => api.activatePrompt(id),
        "Could not activate this version.",
      );

      if (result) toast.success(`Version ${target?.version} is now active`);
      return result;
    },
    [prompts, withRollback],
  );

  const remove = useCallback(
    async (id: string) => {
      const target = prompts.find((p) => p.id === id);

      const result = await withRollback(
        (current) => current.filter((p) => p.id !== id),
        () => api.deletePrompt(id),
        "Could not delete this version.",
      );

      if (result) toast.success(`Version ${target?.version} deleted`);
      return result;
    },
    [prompts, withRollback],
  );

  /**
   * The optimized text is generated server-side, so there is nothing to render
   * optimistically — the new version is inserted once the request resolves.
   */
  const optimize = useCallback(async (id: string) => {
    try {
      const created = await api.optimizePrompt(id);
      setPrompts((current) => [created, ...current].sort(byVersionDesc));
      return created;
    } catch (err) {
      toast.error(toErrorMessage(err, "Optimization failed."));
      return null;
    }
  }, []);

  return {
    prompts,
    isLoading,
    error,
    create,
    activate,
    remove,
    optimize,
    refresh,
  };
}
