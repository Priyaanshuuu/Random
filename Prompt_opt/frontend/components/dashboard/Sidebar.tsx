"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/dashboard/prompts",
    label: "Prompts",
    icon: FileText,
    exact: false,
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "relative flex flex-col h-full bg-surface border-r border-border transition-all duration-300 shrink-0",
        collapsed ? "w-[60px]" : "w-[220px]",
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center gap-2.5 h-14 px-4 border-b border-border shrink-0",
          collapsed && "justify-center px-0",
        )}
      >
        <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-primary/15 text-primary">
          <Zap size={15} />
        </div>
        {!collapsed && (
          <span className="font-semibold text-sm text-foreground tracking-tight">
            Promptly
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-hidden">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact
            ? pathname === href
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted hover:bg-surface-2 hover:text-foreground",
                collapsed && "justify-center px-0",
              )}
            >
              <Icon size={15} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-border shrink-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full h-8 rounded-lg text-muted hover:bg-surface-2 hover:text-foreground transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </aside>
  );
}
