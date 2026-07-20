"use client";

import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { ArrowUp, Square } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChatInputHandle {
  setValue: (value: string) => void;
  focus: () => void;
}

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  onStop?: () => void;
}

export const ChatInput = forwardRef<ChatInputHandle, ChatInputProps>(
  function ChatInput({ onSend, isLoading = false, onStop }, ref) {
    const [value, setValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-grow the textarea up to a max height.
    useLayoutEffect(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    }, [value]);

    useImperativeHandle(ref, () => ({
      setValue: (v: string) => {
        setValue(v);
        textareaRef.current?.focus();
      },
      focus: () => textareaRef.current?.focus(),
    }));

    const submit = () => {
      const trimmed = value.trim();
      if (!trimmed || isLoading) return;
      onSend(trimmed);
      setValue("");
    };

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      submit();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submit();
      }
    };

    const canSend = value.trim().length > 0 && !isLoading;

    return (
      <div className="border-t border-border bg-background/80 px-4 py-4 backdrop-blur">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div
            className={cn(
              "flex items-end gap-2 rounded-2xl border border-border bg-surface p-2 pl-4 transition-colors focus-within:border-primary/50",
            )}
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Promptly…"
              className="max-h-[200px] flex-1 resize-none bg-transparent py-2 text-[15px] leading-6 text-foreground outline-none placeholder:text-muted/70"
            />

            {isLoading ? (
              <button
                type="button"
                onClick={onStop}
                aria-label="Stop generating"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-foreground transition-colors hover:bg-surface-2/70"
              >
                <Square className="h-4 w-4 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!canSend}
                aria-label="Send message"
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors",
                  canSend
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "cursor-not-allowed bg-surface-2 text-muted",
                )}
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            )}
          </div>

          <p className="mt-2 text-center text-xs text-muted/60">
            Promptly can make mistakes. Demo UI with sample data.
          </p>
        </form>
      </div>
    );
  },
);
