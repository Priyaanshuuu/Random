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

import { Button } from "@/components/ui/button";
import { APP_NAME, PROVIDER_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const MAX_HEIGHT = 200;

export interface ChatInputHandle {
  setValue: (value: string) => void;
  focus: () => void;
}

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  onStop: () => void;
}

export const ChatInput = forwardRef<ChatInputHandle, ChatInputProps>(
  function ChatInput({ onSend, isLoading, onStop }, ref) {
    const [value, setValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-grow the textarea up to a fixed ceiling.
    useLayoutEffect(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
    }, [value]);

    useImperativeHandle(ref, () => ({
      setValue: (next: string) => {
        setValue(next);
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
              "flex items-end gap-2 rounded-2xl border border-border bg-surface p-2 pl-4 shadow-sm transition-colors",
              "focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-ring/20",
            )}
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${APP_NAME}…`}
              aria-label="Message"
              className="max-h-[200px] flex-1 resize-none bg-transparent py-2 text-[15px] leading-6 text-foreground outline-none placeholder:text-muted-foreground/70"
            />

            {isLoading ? (
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={onStop}
                aria-label="Stop generating"
                className="rounded-xl"
              >
                <Square className="fill-current" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                disabled={!canSend}
                aria-label="Send message"
                className="rounded-xl"
              >
                <ArrowUp />
              </Button>
            )}
          </div>

          <p className="mt-2 text-center text-xs text-muted-foreground/70">
            Responses run against your active prompt via {PROVIDER_NAME}. Press{" "}
            <kbd className="rounded border border-border bg-surface-2 px-1 font-mono">
              Shift
            </kbd>
            {" + "}
            <kbd className="rounded border border-border bg-surface-2 px-1 font-mono">
              Enter
            </kbd>{" "}
            for a new line.
          </p>
        </form>
      </div>
    );
  },
);
