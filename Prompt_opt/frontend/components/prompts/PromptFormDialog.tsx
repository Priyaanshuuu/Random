"use client";

import { useState } from "react";
import { Wand2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toErrorMessage } from "@/lib/api/client";

interface PromptFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (prompt: string) => Promise<unknown>;
}

/** Modal for authoring a new system-prompt version. */
export function PromptFormDialog({
  open,
  onOpenChange,
  onCreate,
}: PromptFormDialogProps) {
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setValue("");
    setError(null);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleSubmit = async () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Prompt cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onCreate(trimmed);
      handleOpenChange(false);
    } catch (err) {
      setError(toErrorMessage(err, "Could not create this version."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") void handleSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Wand2 className="size-4 text-primary" />
            New prompt version
          </DialogTitle>
          <DialogDescription>
            This becomes the system prompt for new chat conversations once you
            activate it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 px-5">
          <label
            htmlFor="prompt-body"
            className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
          >
            System prompt
          </label>
          <Textarea
            id="prompt-body"
            autoFocus
            rows={9}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="You are a helpful assistant that…"
            aria-invalid={Boolean(error)}
            aria-describedby="prompt-body-hint"
            className="resize-none"
          />
          <p
            id="prompt-body-hint"
            className={
              error ? "text-xs text-destructive" : "text-xs text-muted-foreground"
            }
          >
            {error ?? (
              <>
                Press{" "}
                <kbd className="rounded border border-border bg-surface-2 px-1 py-0.5 font-mono">
                  ⌘ Enter
                </kbd>{" "}
                to submit
              </>
            )}
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} loading={isSubmitting}>
            {isSubmitting ? "Creating…" : "Create version"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
