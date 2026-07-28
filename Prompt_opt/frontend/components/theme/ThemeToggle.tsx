"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Theme switch.
 *
 * Both icons are always rendered and swapped with a CSS `dark:` variant, so the
 * server and client markup match without waiting for next-themes to resolve.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("relative", className)}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <Sun className="absolute scale-0 rotate-90 transition-transform duration-200 dark:scale-100 dark:rotate-0" />
      <Moon className="scale-100 rotate-0 transition-transform duration-200 dark:scale-0 dark:-rotate-90" />
    </Button>
  );
}
