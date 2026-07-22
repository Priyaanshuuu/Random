"use client";
import { useState, useEffect, useCallback } from "react";
import {
  PromptVersion,
  fetchPrompts,
  createPrompt,
  activatePrompt,
  deletePromptById,
} from "@/lib/api";

export function usePrompts() {
  const [prompts, setPrompts] = useState<PromptVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPrompts();
      setPrompts(data);
    } catch {
      setError("Failed to load prompts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (prompt: string) => {
    const newPrompt = await createPrompt(prompt);
    setPrompts((prev) => [newPrompt, ...prev]);
  };

  const activate = async (id: string) => {
    await activatePrompt(id);
    setPrompts((prev) => prev.map((p) => ({ ...p, isActive: p.id === id })));
  };

  const remove = async (id: string) => {
    await deletePromptById(id);
    setPrompts((prev) => prev.filter((p) => p.id !== id));
  };

  return { prompts, loading, error, create, activate, remove, refresh: load };
}
