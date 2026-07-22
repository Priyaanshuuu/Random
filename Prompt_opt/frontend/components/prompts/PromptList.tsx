"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { usePrompts } from "@/hooks/usePrompts";
import { PromptCard } from "./PromptCard";
import { PromptForm } from "./PromptForm";
import { DeletePromptDialog } from "./DeletePromptDialog";
import { EmptyState } from "./EmptyState";
import { Button } from "@/components/ui/button";
import { PromptVersion } from "@/lib/api";

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-5 w-14 rounded-md bg-surface-2" />
        <div className="h-4 w-24 rounded-md bg-surface-2" />
      </div>
      <div className="space-y-2 flex-1">
        <div className="h-3.5 w-full rounded-md bg-surface-2" />
        <div className="h-3.5 w-5/6 rounded-md bg-surface-2" />
        <div className="h-3.5 w-4/6 rounded-md bg-surface-2" />
      </div>
      <div className="flex gap-2 pt-2 border-t border-border/60">
        <div className="h-8 flex-1 rounded-xl bg-surface-2" />
        <div className="h-8 w-9 rounded-xl bg-surface-2" />
      </div>
    </div>
  );
}

export function PromptList() {
  const { prompts, loading, error, create, activate, remove } = usePrompts();
  const [formOpen, setFormOpen] = useState(false);
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [promptToDelete, setPromptToDelete] = useState<PromptVersion | null>(
    null,
  );

  const handleActivate = async (id: string) => {
    setActivatingId(id);
    try {
      await activate(id);
    } finally {
      setActivatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    await remove(id);
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Prompt Versions
          </h2>
          <p className="text-xs text-muted mt-0.5">
            {loading
              ? "Loading…"
              : `${prompts.length} version${prompts.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setFormOpen(true)}>
          <Plus size={14} />
          New Prompt
        </Button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : prompts.length === 0 ? (
        <EmptyState onCreate={() => setFormOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onActivate={handleActivate}
              onDelete={setPromptToDelete}
              isActivating={activatingId === prompt.id}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <PromptForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onCreate={create}
      />
      <DeletePromptDialog
        prompt={promptToDelete}
        onClose={() => setPromptToDelete(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
