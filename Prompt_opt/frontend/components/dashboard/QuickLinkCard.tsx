import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface QuickLinkCardProps {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Accent color for the icon chip and hover border. */
  tone?: "primary" | "accent";
}

export function QuickLinkCard({
  href,
  title,
  description,
  icon: Icon,
  tone = "primary",
}: QuickLinkCardProps) {
  const isPrimary = tone === "primary";

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5",
        isPrimary ? "hover:border-primary/40" : "hover:border-accent/40",
      )}
    >
      <div
        className={cn(
          "flex size-10 items-center justify-center rounded-lg",
          isPrimary
            ? "bg-primary/10 text-primary"
            : "bg-accent/10 text-accent",
        )}
      >
        <Icon className="size-4.5" />
      </div>

      <div className="space-y-0.5">
        <p
          className={cn(
            "flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors",
            isPrimary
              ? "group-hover:text-primary"
              : "group-hover:text-accent",
          )}
        >
          {title}
          <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </Link>
  );
}
