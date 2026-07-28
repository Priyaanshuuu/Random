"use client";

import { useMemo, useState } from "react";
import { FileText, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { usePrompts } from "@/hooks/usePrompts";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PromptCard } from "./PromptCard";
import { PromptToolbar } from "./PromptToolbar";
import { PromptFormDialog } from "./PromptFormDialog";
import { PromptGridSkeleton } from "./PromptCardSkeleton";
import type { PromptVersion } from "@/lib/types";

export function PromptList() {
  const {
    prompts,
    isLoading,
    error,
    create,
    activate,
    remove,
    optimize,
    refresh,
  } = usePrompts();

  const [query, setQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState<PromptVersion | null>(
    null,
  );
  const [optimizingId, setOptimizingId] = useState<string | null>(null);
  const [newVersionId, setNewVersionId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return prompts;
    return prompts.filter(
      (p) =>
        p.prompt.toLowerCase().includes(needle) ||
        `v${p.version}`.includes(needle),
    );
  }, [prompts, query]);

  const handleOptimize = async (prompt: PromptVersion) => {
    setOptimizingId(prompt.id);
    const created = await optimize(prompt.id);
    setOptimizingId(null);

    if (created) {
      setNewVersionId(created.id);
      setQuery("");
      toast.success(`Version ${created.version} generated`, {
        description: `Optimized from v${prompt.version}. Activate it to start using it.`,
        action: {
          label: "Activate",
          onClick: () => void activate(created.id),
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prompt versions"
        description="Author, evaluate, and promote the system prompt that powers your chat."
      />

      <PromptToolbar
        query={query}
        onQueryChange={setQuery}
        onCreate={() => setIsFormOpen(true)}
        resultCount={filtered.length}
        totalCount={prompts.length}
        isLoading={isLoading}
      />

      {optimizingId && (
        <div
          className="space-y-2 rounded-xl border border-primary/30 bg-primary/5 p-4"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Sparkles className="size-4 animate-pulse text-primary" />
            Optimizing prompt…
          </div>
          <p className="text-xs text-muted-foreground">
            Rewriting based on recent evaluation feedback. This creates a new
            inactive version.
          </p>
          {/* Duration is unknown, so this reads as activity rather than progress. */}
          <Progress value={65} className="h-1.5 animate-pulse" />
        </div>
      )}

      {error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : isLoading ? (
        <PromptGridSkeleton />
      ) : prompts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No prompt versions yet"
          description="Create your first version to start testing and optimizing how the assistant behaves."
          action={<Button onClick={() => setIsFormOpen(true)}>New prompt</Button>}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matching versions"
          description={`Nothing matches “${query}”. Try a different search term.`}
          action={
            <Button variant="outline" onClick={() => setQuery("")}>
              Clear search
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onActivate={(p) => void activate(p.id)}
              onOptimize={handleOptimize}
              onDelete={setPromptToDelete}
              isOptimizing={optimizingId === prompt.id}
              isJustCreated={newVersionId === prompt.id}
            />
          ))}
        </div>
      )}

      <PromptFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onCreate={create}
      />

      <ConfirmDialog
        open={Boolean(promptToDelete)}
        onOpenChange={(open) => !open && setPromptToDelete(null)}
        title="Delete this version?"
        description={
          <>
            Version{" "}
            <span className="font-medium text-foreground">
              v{promptToDelete?.version}
            </span>{" "}
            will be permanently removed. This cannot be undone.
          </>
        }
        confirmLabel="Delete"
        destructive
        onConfirm={() => promptToDelete && remove(promptToDelete.id)}
      />
    </div>
  );
}
