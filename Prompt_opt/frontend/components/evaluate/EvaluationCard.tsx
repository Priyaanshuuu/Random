import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getScoreBand } from "@/lib/score";
import { cn, formatRelativeTime } from "@/lib/utils";

interface EvaluationCardProps {
  score: number;
  feedback: string;
  createdAt?: string | Date;
  className?: string;
}

/** Displays a single judge result: score, progress bar, and written feedback. */
export function EvaluationCard({
  score,
  feedback,
  createdAt,
  className,
}: EvaluationCardProps) {
  const band = getScoreBand(score);

  return (
    <article
      className={cn(
        "rounded-xl border border-border bg-card p-5 transition-colors hover:border-border/80",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-baseline gap-1.5">
          <span className={cn("text-2xl font-semibold tabular-nums", band.text)}>
            {score}
          </span>
          <span className="text-sm text-muted-foreground">/ 100</span>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={band.tone === "destructive" ? "destructive" : band.tone}>
            {band.label}
          </Badge>
          {createdAt && (
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(createdAt)}
            </span>
          )}
        </div>
      </header>

      <Progress
        value={score}
        aria-label={`Score ${score} out of 100`}
        className="mt-3 h-1.5"
        indicatorClassName={band.bar}
      />

      <section className="mt-4 border-t border-border/60 pt-3">
        <h4 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Feedback
        </h4>
        <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">
          {feedback}
        </p>
      </section>
    </article>
  );
}
