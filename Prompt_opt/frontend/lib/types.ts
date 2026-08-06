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
  messageId: string;
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
  messageId?: string;
  /** A verdict already stored for this message, loaded with the thread. */
  evaluation?: Evaluation;
  /** Set when the turn failed, so the UI can offer a retry. */
  error?: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  messages: ChatMessage[];
  /** Absent until the server has persisted the thread's first turn. */
  serverId?: string;
}

/** Response shape of `POST /api/chat`. */
export interface ChatResponse {
  conversationId: string;
  /** Id of the persisted assistant message — this is what the judge scores. */
  messageId: string;
  answer: string;
}

/** Row shape of `GET /api/conversations`. */
export interface ConversationRecord {
  id: string;
  title: string | null;
  createdAt: string;
  messages: {
    id: string;
    role: string;
    content: string;
    createdAt: string;
    evaluation: Evaluation | null;
  }[];
}
