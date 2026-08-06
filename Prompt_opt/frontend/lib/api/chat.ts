import type { ChatResponse, ConversationRecord } from "@/lib/types";
import { apiFetch } from "./client";

/**
 * Sends a single turn. Omit `conversationId` to start a new thread; pass one to
 * append to an existing thread so the assistant keeps its context.
 */
export function sendChatMessage(
  message: string,
  conversationId?: string,
  signal?: AbortSignal,
) {
  return apiFetch<ChatResponse>("/api/chat", {
    method: "POST",
    body: { message, conversationId },
    signal,
  });
}

/** Persisted threads, newest first. */
export function fetchConversations(signal?: AbortSignal) {
  return apiFetch<ConversationRecord[]>("/api/conversations", { signal });
}
