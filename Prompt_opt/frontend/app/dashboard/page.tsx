import Link from "next/link";
import { CircleSlash, FileText, MessageSquare } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { QuickLinkCard } from "@/components/dashboard/QuickLinkCard";
import { EvaluationCard } from "@/components/evaluate/EvaluationCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

export const metadata = { title: "Overview" };

// Reads live rows on every request; without this the page is prerendered at
// build time and would keep serving the evaluations that existed then.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [evaluations, activePrompt] = await Promise.all([
    prisma.evaluation.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.promptVersion.findFirst({ where: { isActive: true } }),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome to ${APP_NAME}`}
        description="Author prompts, test them in chat, and let evaluation feedback drive the next version."
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <QuickLinkCard
          href="/dashboard/prompts"
          title="Prompt management"
          description="Create, activate, and optimize prompt versions."
          icon={FileText}
          tone="primary"
        />
        <QuickLinkCard
          href="/chat"
          title="Chat playground"
          description="Run your active prompt against real conversations."
          icon={MessageSquare}
          tone="accent"
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Active prompt</h2>

        {activePrompt ? (
          <div className="rounded-xl border border-accent/40 bg-accent/[0.03] p-5">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="outline" className="font-mono">
                v{activePrompt.version}
              </Badge>
              <Badge variant="accent">
                <span className="size-1.5 rounded-full bg-current" />
                Active
              </Badge>
            </div>
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-foreground/80">
              {activePrompt.prompt}
            </p>
          </div>
        ) : (
          <EmptyState
            icon={CircleSlash}
            title="No active prompt"
            description="Chat needs an active prompt version before it can respond. Activate one to get started."
            action={
              <Button asChild>
                <Link href="/dashboard/prompts">Go to prompts</Link>
              </Button>
            }
          />
        )}
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Recent evaluations
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            The latest judge feedback — this is what the optimizer reads when
            generating a new version.
          </p>
        </div>

        {evaluations.length === 0 ? (
          <EmptyState
            icon={CircleSlash}
            title="No evaluations yet"
            description="Send a message in chat, then hit Evaluate on the reply to score it."
            action={
              <Button variant="outline" asChild>
                <Link href="/chat">Open chat</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {evaluations.map((evaluation) => (
              <EvaluationCard
                key={evaluation.id}
                score={evaluation.score}
                feedback={evaluation.feedback}
                createdAt={evaluation.createdAt}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
