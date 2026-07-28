"use client";

import { Plus, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PromptToolbarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onCreate: () => void;
  /** Number of versions matching the current query. */
  resultCount: number;
  totalCount: number;
  isLoading: boolean;
}

export function PromptToolbar({
  query,
  onQueryChange,
  onCreate,
  resultCount,
  totalCount,
  isLoading,
}: PromptToolbarProps) {
  const summary = isLoading
    ? "Loading versions…"
    : query
      ? `${resultCount} of ${totalCount} versions`
      : `${totalCount} version${totalCount === 1 ? "" : "s"}`;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search prompts…"
          aria-label="Search prompt versions"
          className="pl-9"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            aria-label="Clear search"
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span className="text-xs text-muted-foreground">{summary}</span>
        <Button size="sm" onClick={onCreate}>
          <Plus />
          New prompt
        </Button>
      </div>
    </div>
  );
}
