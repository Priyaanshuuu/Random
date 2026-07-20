import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: number;
  label?: string;
}

/** Simple spinner used for inline and full-area loading states. */
export function Loading({ className, size = 18, label }: LoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex items-center gap-2 text-muted", className)}
    >
      <Loader2 className="animate-spin" style={{ width: size, height: size }} />
      {label ? <span className="text-sm">{label}</span> : null}
      <span className="sr-only">Loading</span>
    </div>
  );
}
