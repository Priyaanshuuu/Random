"use client";
import { FileText, Plus } from "lucide-react";

interface EmptyStateProps {
  onCreate: () => void;
}

export function EmptyState({ onCreate }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-2 border border-border mb-4">
        <FileText size={26} className="text-muted" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">
        No prompt versions yet
      </h3>
      <p className="text-sm text-muted max-w-xs mb-6 leading-relaxed">
        Create your first prompt version to start building and optimizing your
        AI workflows.
      </p>
      <button
        onClick={onCreate}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        <Plus size={14} />
        New Prompt
      </button>
    </div>
  );
}
