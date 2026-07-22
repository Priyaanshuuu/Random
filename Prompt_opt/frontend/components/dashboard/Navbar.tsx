"use client";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/prompts": "Prompt Management",
};

export function Navbar() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Dashboard";

  return (
    <header className="flex items-center h-14 px-6 border-b border-border bg-surface/80 backdrop-blur-sm shrink-0">
      <h1 className="text-sm font-semibold text-foreground">{title}</h1>
    </header>
  );
}
