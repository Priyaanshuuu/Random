"use client";

import { Sparkles } from "lucide-react";

import { SUGGESTED_PROMPTS } from "@/lib/constants";

interface ChatEmptyStateProps {
  onPick: (prompt: string) => void;
}

/** Shown in the chat area when the active conversation has no messages. */
export function ChatEmptyState({ onPick }: ChatEmptyStateProps) {
  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30">
        <Sparkles className="size-6" />
      </div>

      <h2 className="mt-6 text-2xl font-semibold tracking-tight">
        Test your active prompt
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Every message runs against the prompt version you have marked active.
        Try one of these to get started:
      </p>

      <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onPick(prompt)}
            className="rounded-xl border border-border bg-surface/60 p-4 text-left text-sm text-foreground/90 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-surface"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
