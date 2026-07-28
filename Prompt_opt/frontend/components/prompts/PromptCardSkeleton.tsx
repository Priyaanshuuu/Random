import { Skeleton } from "@/components/ui/skeleton";

/** Placeholder matching the PromptCard layout while versions load. */
export function PromptCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <Skeleton className="h-5 w-12 rounded-full" />
        <Skeleton className="size-8 rounded-lg" />
      </div>
      <div className="mt-3 min-h-[5.5rem] flex-1 space-y-2">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-11/12" />
        <Skeleton className="h-3.5 w-4/6" />
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

export function PromptGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <PromptCardSkeleton key={i} />
      ))}
    </div>
  );
}
