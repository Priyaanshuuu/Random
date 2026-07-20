"use client";

import Link from "next/link";
import {
  Sparkles,
  Plus,
  Settings,
  MessageSquare,
  X,
  PanelLeftClose,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/lib/dummy-data";

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  /** mobile drawer open state */
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  open = false,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border bg-surface transition-transform duration-200 md:static md:z-auto md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex h-14 shrink-0 items-center justify-between px-3">
          <Link href="/" className="flex items-center gap-2 px-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight">Promptly</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-foreground md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* New chat */}
        <div className="px-3 pb-2">
          <button
            type="button"
            onClick={onNewChat}
            className="flex w-full items-center gap-2 rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-surface-2/70"
          >
            <Plus className="h-4 w-4" />
            New chat
          </button>
        </div>

        {/* History */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <p className="px-2 pt-2 pb-1 text-xs font-medium text-muted/70">
            Recent
          </p>
          <nav className="space-y-0.5">
            {conversations.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelect(c.id)}
                className={cn(
                  "group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                  c.id === activeId
                    ? "bg-surface-2 text-foreground"
                    : "text-muted hover:bg-surface-2/60 hover:text-foreground",
                )}
              >
                <MessageSquare className="h-4 w-4 shrink-0 opacity-70" />
                <span className="min-w-0 flex-1 truncate">{c.title}</span>
                <span className="shrink-0 text-[10px] text-muted/50">
                  {c.updatedAt}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Settings / footer */}
        <div className="shrink-0 border-t border-border p-3">
          <button
            type="button"
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
          <div className="mt-2 flex items-center gap-2.5 rounded-lg px-2.5 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
              JD
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground/90">
                Jane Doe
              </p>
              <p className="truncate text-xs text-muted/70">Free plan</p>
            </div>
            <PanelLeftClose className="h-4 w-4 text-muted/50" />
          </div>
        </div>
      </aside>
    </>
  );
}
