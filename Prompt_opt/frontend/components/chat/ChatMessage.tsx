"use client";

import { AlertTriangle, RotateCw, Sparkles, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/shared/CopyButton";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { Markdown } from "./Markdown";

function Avatar({ role }: { role: ChatMessageType["role"] }) {
  const isUser = role === "user";
  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-lg ring-1",
        isUser
          ? "bg-surface-2 text-foreground ring-border"
          : "bg-primary/15 text-primary ring-primary/30",
      )}
    >
      {isUser ? <User className="size-4" /> : <Sparkles className="size-4" />}
    </div>
  );
}

interface ChatMessageProps {
  message: ChatMessageType;
  /** Rendered beneath assistant replies, e.g. the evaluate action. */
  actions?: React.ReactNode;
  onRetry?: (messageId: string) => void;
}

export function ChatMessage({ message, actions, onRetry }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className="group animate-fade-up py-5">
      <div className="mx-auto flex max-w-3xl gap-4 px-4">
        <Avatar role={message.role} />

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="mb-1 text-xs font-medium text-muted-foreground">
            {isUser ? "You" : APP_NAME}
          </div>

          {message.error ? (
            <div className="flex flex-col items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 sm:flex-row sm:items-center">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
                <p className="text-sm text-muted-foreground">{message.error}</p>
              </div>
              {onRetry && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRetry(message.id)}
                  className="sm:ml-auto"
                >
                  <RotateCw />
                  Retry
                </Button>
              )}
            </div>
          ) : isUser ? (
            <div className="w-fit max-w-full rounded-2xl rounded-tl-sm bg-surface-2 px-4 py-2.5 text-[15px] leading-7 whitespace-pre-wrap text-foreground/95">
              {message.content}
            </div>
          ) : (
            <>
              <Markdown content={message.content} />

              <div className="mt-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                <CopyButton value={message.content} label="Copy" size="sm" />
                {actions}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** Animated "assistant is typing" indicator. */
export function TypingIndicator() {
  return (
    <div className="py-5" role="status" aria-live="polite">
      <div className="mx-auto flex max-w-3xl gap-4 px-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
          <Sparkles className="size-4" />
        </div>
        <div className="flex items-center gap-1.5 pt-2.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="animate-typing-dot size-2 rounded-full bg-muted-foreground"
              style={{ animationDelay: `${i * 0.16}s` }}
            />
          ))}
          <span className="sr-only">{APP_NAME} is thinking</span>
        </div>
      </div>
    </div>
  );
}
