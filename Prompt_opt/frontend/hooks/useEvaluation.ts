"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { evaluateConversation } from "@/lib/api/evaluations";
import { toErrorMessage } from "@/lib/api/client";
import type { Evaluation } from "@/lib/types";

/** Scores a persisted conversation via the existing `/api/evaluate` route. */
export function useEvaluation() {
  const [results, setResults] = useState<Record<string, Evaluation>>({});
  const [pendingId, setPendingId] = useState<string | null>(null);

  const evaluate = useCallback(async (conversationId: string) => {
    setPendingId(conversationId);
    try {
      const evaluation = await evaluateConversation(conversationId);
      setResults((current) => ({ ...current, [conversationId]: evaluation }));
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
