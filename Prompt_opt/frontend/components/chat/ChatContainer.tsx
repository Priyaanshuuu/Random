"use client";

import { useEffect, useRef } from "react";
import { Gauge } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useEvaluation } from "@/hooks/useEvaluation";
import { EvaluationCard } from "@/components/evaluate/EvaluationCard";
import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { ChatMessage, TypingIndicator } from "./ChatMessage";
import { ChatInput, type ChatInputHandle } from "./ChatInput";
import { ChatEmptyState } from "./ChatEmptyState";

interface ChatContainerProps {
  messages: ChatMessageType[];
  isSending: boolean;
  onSend: (message: string) => void;
  onStop: () => void;
  onRetry: (messageId: string) => void;
}

export function ChatContainer({
  messages,
  isSending,
  onSend,
  onStop,
  onRetry,
}: ChatContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<ChatInputHandle>(null);
  const { results, pendingId, evaluate } = useEvaluation();

  // Follow the newest message / typing indicator.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isSending]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <ChatEmptyState onPick={(p) => inputRef.current?.setValue(p)} />
        ) : (
          <div className="pb-6">
            {messages.map((message) => {
              const conversationId = message.conversationId;
              const evaluation = conversationId
                ? results[conversationId]
                : undefined;

              return (
                <div key={message.id}>
                  <ChatMessage
                    message={message}
                    onRetry={onRetry}
                    actions={
                      conversationId && !evaluation ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground"
                          loading={pendingId === conversationId}
                          onClick={() => void evaluate(conversationId)}
                        >
                          {pendingId === conversationId ? null : <Gauge />}
                          Evaluate
                        </Button>
                      ) : null
                    }
                  />

                  {evaluation && (
                    <div className="mx-auto max-w-3xl px-4 pb-2 pl-16">
                      <EvaluationCard
                        score={evaluation.score}
                        feedback={evaluation.feedback}
                        createdAt={evaluation.createdAt}
                        className="animate-fade-up"
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {isSending && <TypingIndicator />}
          </div>
        )}
      </div>

      <ChatInput
        ref={inputRef}
        onSend={onSend}
        isLoading={isSending}
        onStop={onStop}
      />
    </div>
  );
}
