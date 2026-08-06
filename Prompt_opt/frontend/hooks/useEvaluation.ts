"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { evaluateMessage } from "@/lib/api/evaluations";
import { toErrorMessage } from "@/lib/api/client";
import type { Evaluation } from "@/lib/types";

/** Scores a persisted assistant message via the `/api/evaluate` route. */
export function useEvaluation() {
  const [results, setResults] = useState<Record<string, Evaluation>>({});
  const [pendingId, setPendingId] = useState<string | null>(null);

  const evaluate = useCallback(async (messageId: string) => {
    setPendingId(messageId);
    try {
      const evaluation = await evaluateMessage(messageId);
      setResults((current) => ({ ...current, [messageId]: evaluation }));
      toast.success(`Scored ${evaluation.score}/100`);
      return evaluation;
    } catch (err) {
      toast.error(toErrorMessage(err, "Evaluation failed."));
      return null;
    } finally {
      setPendingId(null);
    }
  }, []);

  return { results, pendingId, evaluate };
}
