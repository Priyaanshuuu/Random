"use client";

import Link from "next/link";
import { MessageSquare, Plus, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { Conversation } from "@/lib/types";

interface SidebarProps {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  /** Mobile drawer open state. */
  open: boolean;
  onClose: () => void;
}

export function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  open,
  onClose,
}: SidebarProps) {
  const handleSelect = (id: string) => {
    onSelect(id);
    onClose();
  };

  return (
    <>
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
        <div className="flex h-14 shrink-0 items-center justify-between px-3">
          <Link href="/" className="flex items-center gap-2 px-1">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
              <Sparkles className="size-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight">
              {APP_NAME}
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close sidebar"
            className="md:hidden"
          >
            <X />
          </Button>
        </div>

        <div className="px-3 pb-2">
          <Button
            variant="secondary"
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full justify-start"
          >
            <Plus />
            New chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2">
          <p className="px-2 pt-2 pb-1 text-xs font-medium text-muted-foreground/70">
            This session
          </p>
          <nav className="space-y-0.5">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => handleSelect(conversation.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                  conversation.id === activeId
                    ? "bg-surface-2 text-foreground"
                    : "text-muted-foreground hover:bg-surface-2/60 hover:text-foreground",
                )}
              >
                <MessageSquare className="size-4 shrink-0 opacity-70" />
                <span className="min-w-0 flex-1 truncate">
                  {conversation.title}
                </span>
                <span className="shrink-0 text-[10px] text-muted-foreground/60">
                  {formatRelativeTime(conversation.createdAt)}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="shrink-0 border-t border-border p-3">
          <p className="px-1 text-xs leading-relaxed text-muted-foreground/70">
            Threads live for this browser session only.
          </p>
        </div>
      </aside>
    </>
  );
}
