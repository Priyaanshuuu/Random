"use client";

import { Check, MoreHorizontal, Sparkles, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CopyButton } from "@/components/shared/CopyButton";
import { cn, formatDate } from "@/lib/utils";
import type { PromptVersion } from "@/lib/types";

export interface PromptCardProps {
  prompt: PromptVersion;
  onActivate: (prompt: PromptVersion) => void;
  onOptimize: (prompt: PromptVersion) => void;
  onDelete: (prompt: PromptVersion) => void;
  isOptimizing?: boolean;
  /** Highlights a version that was just produced by the optimizer. */
  isJustCreated?: boolean;
}

export function PromptCard({
  prompt,
  onActivate,
  onOptimize,
  onDelete,
  isOptimizing = false,
  isJustCreated = false,
}: PromptCardProps) {
  return (
    <article
      className={cn(
        "group flex flex-col rounded-xl border bg-card p-5 transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5",
        prompt.isActive
          ? "border-accent/40 bg-accent/[0.03]"
          : "border-border hover:border-primary/30",
        isJustCreated && "animate-fade-up ring-2 ring-primary/40",
      )}
    >
      <header className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="outline" className="font-mono">
            v{prompt.version}
          </Badge>
          {prompt.isActive && (
            <Badge variant="accent">
              <span className="size-1.5 rounded-full bg-current" />
              Active
            </Badge>
          )}
          {isJustCreated && <Badge variant="primary">New</Badge>}
        </div>

        <PromptActionsMenu
          prompt={prompt}
          onActivate={onActivate}
          onOptimize={onOptimize}
          onDelete={onDelete}
          isOptimizing={isOptimizing}
        />
      </header>

      <p className="mt-3 line-clamp-4 min-h-[5.5rem] flex-1 text-sm leading-relaxed text-foreground/80">
        {prompt.prompt}
      </p>

      <footer className="mt-4 flex items-center justify-between gap-2 border-t border-border/60 pt-3">
        <time
          dateTime={prompt.createdAt}
          className="text-xs text-muted-foreground"
        >
          {formatDate(prompt.createdAt)}
        </time>

        <div className="flex items-center gap-1">
          <CopyButton value={prompt.prompt} size="icon-sm" />
          {!prompt.isActive && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onActivate(prompt)}
              className="opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            >
              <Check />
              Activate
            </Button>
          )}
        </div>
      </footer>
    </article>
  );
}

function PromptActionsMenu({
  prompt,
  onActivate,
  onOptimize,
  onDelete,
  isOptimizing,
}: Omit<PromptCardProps, "isJustCreated">) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground"
          aria-label={`Actions for version ${prompt.version}`}
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Version {prompt.version}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={() => onOptimize(prompt)}
          disabled={isOptimizing}
        >
          <Sparkles />
          {isOptimizing ? "Optimizing…" : "Optimize"}
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => onActivate(prompt)}
          disabled={prompt.isActive}
        >
          <Check />
          {prompt.isActive ? "Already active" : "Set as active"}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onSelect={() => onDelete(prompt)}>
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
