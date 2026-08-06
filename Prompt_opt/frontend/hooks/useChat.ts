"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { fetchConversations, sendChatMessage } from "@/lib/api/chat";
import { toErrorMessage } from "@/lib/api/client";
import { truncate } from "@/lib/utils";
import type { Conversation, ConversationRecord } from "@/lib/types";

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

/** Maps a persisted thread onto the shape the sidebar and transcript expect. */
function toConversation(record: ConversationRecord): Conversation {
  return {
    id: record.id,
    serverId: record.id,
    title: record.title ?? "Untitled chat",
    createdAt: new Date(record.createdAt).getTime(),
    messages: record.messages.map((m) => ({
      id: m.id,
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
      messageId: m.role === "assistant" ? m.id : undefined,
      evaluation: m.evaluation ?? undefined,
    })),
  };
}

/**
 * Chat session state, backed by the database.
 *
 * Threads are loaded from `GET /api/conversations` on mount so history survives
 * a refresh. Each send passes the thread's server id to `POST /api/chat`, which
 * replays the full transcript to the model — a thread started in this session
 * learns its id from the first response.
 */
export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>(() => [
    newConversation(),
  ]);
  const [activeId, setActiveId] = useState<string>(() => conversations[0].id);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  // Hydrate the sidebar from persisted threads. The empty draft thread stays at
  // the top so the user can start typing before history arrives.
  useEffect(() => {
    const controller = new AbortController();

    fetchConversations(controller.signal)
      .then((records) => {
        if (records.length === 0) return;
        setConversations((current) => [
          ...current,
          ...records.map(toConversation),
        ]);
      })
      .catch(() => {
        // History is a convenience — a failure here shouldn't block chatting.
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

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

  const send = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isSending) return;

      // Name an untouched thread after its opening message.
      patchActive((c) => ({
        ...c,
        title: c.messages.length === 0 ? truncate(trimmed, 40) : c.title,
        messages: [
          ...c.messages,
          { id: newId(), role: "user", content: trimmed },
        ],
      }));

      setIsSending(true);
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const { answer, conversationId, messageId } = await sendChatMessage(
          trimmed,
          activeConversation.serverId,
          controller.signal,
        );

        patchActive((c) => ({
          ...c,
          // The first reply tells a new thread which id to append to next time.
          serverId: c.serverId ?? conversationId,
          messages: [
            ...c.messages,
            { id: newId(), role: "assistant", content: answer, messageId },
          ],
        }));
      } catch (err) {
        if (controller.signal.aborted) return;
        patchActive((c) => ({
          ...c,
          messages: [
            ...c.messages,
            {
              id: newId(),
              role: "assistant",
              content: "",
              error: toErrorMessage(err, "The assistant could not respond."),
            },
          ],
        }));
      } finally {
        abortRef.current = null;
        setIsSending(false);
      }
    },
    [activeConversation.serverId, isSending, patchActive],
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
      // Drop the failed reply *and* the user turn that provoked it — `send`
      // re-adds the latter, and the server persisted neither.
      patchActive((c) => ({ ...c, messages: c.messages.slice(0, index - 1) }));
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
    isLoading,
    send,
    stop,
    retry,
    selectConversation: setActiveId,
    startNewChat,
  };
}
