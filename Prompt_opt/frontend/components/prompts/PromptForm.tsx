"use client";
import { useState } from "react";
import { X, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PromptFormProps {
  onClose: () => void;
  onCreate: (prompt: string) => Promise<void>;
}

export function PromptForm({ onClose, onCreate }: PromptFormProps) {
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Prompt cannot be empty.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onCreate(trimmed);
      onClose();
    } catch {
      setError("Failed to create prompt. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleSubmit();
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Wand2 size={15} className="text-primary" />
            <h2 className="text-sm font-semibold text-foreground">
              New Prompt Version
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-2">
          <label className="text-xs font-medium text-muted uppercase tracking-wide">
            System Prompt
          </label>
          <textarea
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="You are a helpful assistant that..."
            rows={8}
            className={cn(
              "w-full resize-none rounded-xl bg-surface-2 border px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none transition-colors",
              error
                ? "border-red-500/50 focus:border-red-500"
                : "border-border focus:border-primary/60",
            )}
          />
          {error ? (
            <p className="text-xs text-red-400">{error}</p>
          ) : (
            <p className="text-xs text-muted">
              Tip: Press{" "}
              <kbd className="px-1 py-0.5 rounded bg-surface-2 border border-border font-mono">
                ⌘ Enter
              </kbd>{" "}
              to submit
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Creating…" : "Create Prompt"}
          </Button>
        </div>
      </div>
    </div>
  );
}
