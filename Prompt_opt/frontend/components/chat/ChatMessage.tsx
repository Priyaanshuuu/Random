import { Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/lib/dummy-data";
import { Markdown } from "./Markdown";

function Avatar({ role }: { role: ChatMessageType["role"] }) {
  const isUser = role === "user";
  return (
    <div
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1",
        isUser
          ? "bg-surface-2 text-foreground ring-border"
          : "bg-primary/15 text-primary ring-primary/30",
      )}
    >
      {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
    </div>
  );
}

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";

  return (
    <div className="animate-fade-up py-5">
      <div className="mx-auto flex max-w-3xl gap-4 px-4">
        <Avatar role={message.role} />
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="mb-1 text-xs font-medium text-muted">
            {isUser ? "You" : "Promptly"}
          </div>

          {isUser ? (
            <div className="w-fit max-w-full rounded-2xl rounded-tl-sm bg-surface-2 px-4 py-2.5 text-[15px] leading-7 whitespace-pre-wrap text-foreground/95">
              {message.content}
            </div>
          ) : (
            <Markdown content={message.content} />
          )}
        </div>
      </div>
    </div>
  );
}

/** Animated "assistant is typing" indicator. */
export function TypingIndicator() {
  return (
    <div className="py-5">
      <div className="mx-auto flex max-w-3xl gap-4 px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-1.5 pt-2.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="animate-typing-dot h-2 w-2 rounded-full bg-muted"
              style={{ animationDelay: `${i * 0.16}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
