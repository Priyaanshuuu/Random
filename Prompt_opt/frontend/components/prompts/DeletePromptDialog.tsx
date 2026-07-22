"use client";
import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PromptVersion } from "@/lib/api";

interface DeletePromptDialogProps {
  prompt: PromptVersion | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export function DeletePromptDialog({
  prompt,
  onClose,
  onConfirm,
}: DeletePromptDialogProps) {
  const [deleting, setDeleting] = useState(false);

  if (!prompt) return null;

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm(prompt.id);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm bg-surface border border-border rounded-2xl shadow-2xl animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle size={14} />
            <h2 className="text-sm font-semibold">Delete Prompt</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          <p className="text-sm text-muted leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              v{prompt.version}
            </span>
            ? This action cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={deleting}
            className="bg-red-500/90 hover:bg-red-500 text-white border-0 shadow-none"
          >
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
