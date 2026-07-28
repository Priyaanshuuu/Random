/**
 * Shared client-side types.
 *
 * These mirror the JSON shapes returned by the existing API routes — dates
 * arrive as ISO strings rather than `Date` instances.
 */

export interface PromptVersion {
  id: string;
  version: number;
  prompt: string;
  isActive: boolean;
  createdAt: string;
}

export interface Evaluation {
  id: string;
  conversationId: string;
  score: number;
  feedback: string;
  createdAt: string;
}

export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  /** Present on assistant messages once the server has persisted the turn. */
  conversationId?: string;
  /** Set when the turn failed, so the UI can offer a retry. */
  error?: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  messages: ChatMessage[];
}

/** Response shape of `POST /api/chat`. */
export interface ChatResponse {
  conversationId: string;
  answer: string;
}
