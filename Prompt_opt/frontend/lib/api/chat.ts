import type { ChatResponse } from "@/lib/types";
import { apiFetch } from "./client";

/** Sends a single turn. The server creates a conversation and returns its id. */
export function sendChatMessage(message: string, signal?: AbortSignal) {
  return apiFetch<ChatResponse>("/api/chat", {
    method: "POST",
    body: { message },
    signal,
  });
}
