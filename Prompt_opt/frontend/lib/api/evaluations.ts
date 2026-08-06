import type { Evaluation } from "@/lib/types";
import { apiFetch } from "./client";

/** Scores a persisted assistant message and stores the result. */
export function evaluateMessage(messageId: string) {
  return apiFetch<Evaluation>("/api/evaluate", {
    method: "POST",
    body: { messageId },
  });
}
