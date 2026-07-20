import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "primary" | "accent" | "outline";

const variants: Record<Variant, string> = {
  default: "bg-surface-2 text-muted border border-border",
  primary: "bg-primary/15 text-primary border border-primary/30",
  accent: "bg-accent/10 text-accent border border-accent/25",
  outline: "bg-transparent text-foreground/80 border border-border",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
