"use client";

import Link from "next/link";
import { Cpu, LayoutDashboard, PanelLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ACTIVE_MODEL, PROVIDER_NAME } from "@/lib/constants";

interface NavbarProps {
  title: string;
  onToggleSidebar: () => void;
}

export function Navbar({ title, onToggleSidebar }: NavbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-background/80 px-3 backdrop-blur sm:px-4">
      <div className="flex min-w-0 items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="md:hidden"
        >
          <PanelLeft />
        </Button>
        <h1 className="truncate text-sm font-medium text-foreground/90">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="primary" className="hidden sm:inline-flex">
              <Cpu />
              {ACTIVE_MODEL.label}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            Served by {PROVIDER_NAME} · {ACTIVE_MODEL.id}
          </TooltipContent>
        </Tooltip>

        <ThemeToggle />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard" aria-label="Open dashboard">
                <LayoutDashboard />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Dashboard</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
