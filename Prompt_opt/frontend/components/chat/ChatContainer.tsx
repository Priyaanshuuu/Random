"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage as ChatMessageType } from "@/lib/dummy-data";
import { ChatMessage, TypingIndicator } from "./ChatMessage";
import { ChatInput, type ChatInputHandle } from "./ChatInput";
import { EmptyState } from "@/components/shared/EmptyState";

interface ChatContainerProps {
  messages: ChatMessageType[];
  onMessagesChange: (messages: ChatMessageType[]) => void;
}

// Canned reply — no backend, no API. Purely to demonstrate the UI states.
const DEMO_REPLY = `Great — here's a refined version of that prompt:

\`\`\`text
You are a senior prompt engineer. Rewrite the user's instruction into a
clear, structured prompt with: (1) a role, (2) explicit constraints, and
(3) a defined output format. Keep it concise.
\`\`\`

I focused on **clarity** and **determinism**. Want me to generate an A/B variant?`;

let idCounter = 0;
const nextId = () => `local-${Date.now()}-${idCounter++}`;

export function ChatContainer({
  messages,
  onMessagesChange,
}: ChatContainerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<ChatInputHandle>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isEmpty = messages.length === 0;

  // Autoscroll to the newest message / typing indicator.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  // Clean up a pending simulated reply if unmounted.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSend = (content: string) => {
    const userMessage: ChatMessageType = {
      id: nextId(),
      role: "user",
      content,
    };
    const withUser = [...messages, userMessage];
    onMessagesChange(withUser);
    setIsLoading(true);

    // Simulate an assistant response (UI demo only).
    timerRef.current = setTimeout(() => {
      const assistantMessage: ChatMessageType = {
        id: nextId(),
        role: "assistant",
        content: DEMO_REPLY,
      };
      onMessagesChange([...withUser, assistantMessage]);
      setIsLoading(false);
    }, 1400);
  };

  const handleStop = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <EmptyState onPick={(p) => inputRef.current?.setValue(p)} />
        ) : (
          <div className="pb-6">
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}
            {isLoading && <TypingIndicator />}
          </div>
        )}
      </div>

      <ChatInput
        ref={inputRef}
        onSend={handleSend}
        isLoading={isLoading}
        onStop={handleStop}
      />
    </div>
  );
}
