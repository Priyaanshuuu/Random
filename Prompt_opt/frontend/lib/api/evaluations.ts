import type { Evaluation } from "@/lib/types";
import { apiFetch } from "./client";

/** Scores a persisted conversation and stores the result. */
export function evaluateConversation(conversationId: string) {
  return apiFetch<Evaluation>("/api/evaluate", {
    method: "POST",
    body: { conversationId },
  });
}
