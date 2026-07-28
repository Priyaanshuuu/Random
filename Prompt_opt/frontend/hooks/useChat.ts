"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { sendChatMessage } from "@/lib/api/chat";
import { toErrorMessage } from "@/lib/api/client";
import { truncate } from "@/lib/utils";
import type { ChatMessage, Conversation } from "@/lib/types";

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;

function newConversation(): Conversation {
  return {
    id: newId(),
    title: "New chat",
    createdAt: Date.now(),
    messages: [],
  };
}

/**
 * Chat session state.
 *
 * `POST /api/chat` persists one conversation per turn and there is no endpoint
 * for listing past conversations, so the sidebar's thread list is kept in
 * client memory for the duration of the session. Each assistant message still
 * carries the server-side `conversationId` it was persisted under, which is
 * what the evaluator needs.
 */
export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>(() => [
    newConversation(),
  ]);
  const [activeId, setActiveId] = useState<string>(() => conversations[0].id);
  const [isSending, setIsSending] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const activeConversation =
    conversations.find((c) => c.id === activeId) ?? conversations[0];

  const patchActive = useCallback(
    (update: (conversation: Conversation) => Conversation) => {
      setConversations((current) =>
        current.map((c) => (c.id === activeId ? update(c) : c)),
      );
    },
    [activeId],
  );

  const appendMessages = useCallback(
    (...messages: ChatMessage[]) => {
      patchActive((c) => ({ ...c, messages: [...c.messages, ...messages] }));
    },
    [patchActive],
  );

  const send = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isSending) return;

      const userMessage: ChatMessage = {
        id: newId(),
        role: "user",
        content: trimmed,
      };

      // Name an untouched thread after its opening message.
      patchActive((c) => ({
        ...c,
        title: c.messages.length === 0 ? truncate(trimmed, 40) : c.title,
        messages: [...c.messages, userMessage],
      }));

      setIsSending(true);
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const { answer, conversationId } = await sendChatMessage(
          trimmed,
          controller.signal,
        );
        appendMessages({
          id: newId(),
          role: "assistant",
          content: answer,
          conversationId,
        });
      } catch (err) {
        if (controller.signal.aborted) return;
        appendMessages({
          id: newId(),
          role: "assistant",
          content: "",
          error: toErrorMessage(err, "The assistant could not respond."),
        });
      } finally {
        abortRef.current = null;
        setIsSending(false);
      }
    },
    [appendMessages, isSending, patchActive],
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsSending(false);
  }, []);

  /** Drops the failed placeholder and resends the preceding user message. */
  const retry = useCallback(
    (messageId: string) => {
      const messages = activeConversation.messages;
      const index = messages.findIndex((m) => m.id === messageId);
      if (index < 1) return;

      const previous = messages[index - 1];
      patchActive((c) => ({ ...c, messages: c.messages.slice(0, index) }));
      void send(previous.content);
    },
    [activeConversation.messages, patchActive, send],
  );

  const startNewChat = useCallback(() => {
    const conversation = newConversation();
    setConversations((current) => [conversation, ...current]);
    setActiveId(conversation.id);
  }, []);

  return {
    conversations,
    activeConversation,
    activeId,
    isSending,
    send,
    stop,
    retry,
    selectConversation: setActiveId,
    startNewChat,
  };
}
