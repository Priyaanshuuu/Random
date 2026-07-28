import { Skeleton } from "@/components/ui/skeleton";

export function EvaluationCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="mt-3 h-1.5 w-full rounded-full" />
      <div className="mt-4 space-y-2 border-t border-border/60 pt-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-3/4" />
      </div>
    </div>
  );
}
