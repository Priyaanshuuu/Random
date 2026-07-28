"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { PROVIDER_NAME } from "@/lib/constants";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/prompts": "Prompts",
};

export function Navbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Dashboard";

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-surface/80 px-3 backdrop-blur sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        aria-label="Open navigation"
        className="md:hidden"
      >
        <Menu />
      </Button>

      <h1 className="truncate text-sm font-semibold text-foreground">{title}</h1>

      <div className="ml-auto flex items-center gap-1.5">
        <Badge variant="outline" className="hidden sm:inline-flex">
          Powered by {PROVIDER_NAME}
        </Badge>
        <ThemeToggle />
        <Button variant="secondary" size="sm" asChild>
          <Link href="/chat">
            <MessageSquare />
            <span className="hidden sm:inline">Open chat</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
