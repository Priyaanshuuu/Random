"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyButtonProps extends Omit<ButtonProps, "onClick" | "children"> {
  value: string;
  label?: string;
}

/** Copies `value` to the clipboard and flashes a confirmation for 1.5s. */
export function CopyButton({
  value,
  label,
  className,
  variant = "ghost",
  size = "icon-sm",
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard is unavailable (insecure context) — fail silently.
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={copy}
      aria-label={copied ? "Copied" : (label ?? "Copy")}
      className={cn("text-muted-foreground hover:text-foreground", className)}
      {...props}
    >
      {copied ? <Check className="text-success" /> : <Copy />}
      {label && <span>{copied ? "Copied" : label}</span>}
    </Button>
  );
}
