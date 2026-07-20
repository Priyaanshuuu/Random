"use client";

import { GitBranch, Cpu, PanelLeft, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ACTIVE_MODEL, ACTIVE_PROMPT_VERSION } from "@/lib/dummy-data";

interface NavbarProps {
  title?: string;
  onToggleSidebar?: () => void;
}

export function Navbar({ title = "New chat", onToggleSidebar }: NavbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-background/80 px-3 backdrop-blur sm:px-4">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-foreground md:hidden"
        >
          <PanelLeft className="h-4.5 w-4.5" />
        </button>
        <h1 className="truncate text-sm font-medium text-foreground/90">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="accent" className="hidden sm:inline-flex">
          <GitBranch className="h-3.5 w-3.5" />
          Prompt {ACTIVE_PROMPT_VERSION}
        </Badge>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs font-medium text-foreground/90 transition-colors hover:border-primary/40"
        >
          <Cpu className="h-3.5 w-3.5 text-primary" />
          {ACTIVE_MODEL.label}
          <ChevronDown className="h-3.5 w-3.5 text-muted" />
        </button>
      </div>
    </header>
  );
}
