"use client";
import { CheckCircle, Trash2, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PromptVersion } from "@/lib/api";

interface PromptCardProps {
  prompt: PromptVersion;
  onActivate: (id: string) => void;
  onDelete: (prompt: PromptVersion) => void;
  isActivating: boolean;
}

export function PromptCard({
  prompt,
  onActivate,
  onDelete,
  isActivating,
}: PromptCardProps) {
  const date = new Date(prompt.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border bg-surface p-5 transition-all duration-200",
        prompt.isActive
          ? "border-primary/30 bg-primary/5"
          : "border-border hover:border-border/80",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium text-muted bg-surface-2 px-2 py-0.5 rounded-md border border-border">
            v{prompt.version}
          </span>
          {prompt.isActive && (
            <Badge variant="accent">
              <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
              Active
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted">
          <Calendar size={11} />
          <span>{date}</span>
        </div>
      </div>

      {/* Prompt preview */}
      <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3 flex-1 min-h-18">
        {prompt.prompt}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-border/60">
        {!prompt.isActive && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onActivate(prompt.id)}
            disabled={isActivating}
            className="flex-1"
          >
            <CheckCircle size={13} />
            {isActivating ? "Activating…" : "Activate"}
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(prompt)}
          className={cn(
            "text-muted hover:text-red-400 hover:bg-red-500/10",
            prompt.isActive && "flex-1",
          )}
        >
          <Trash2 size={13} />
          {prompt.isActive && <span className="ml-1.5">Delete</span>}
        </Button>
      </div>
    </div>
  );
}
