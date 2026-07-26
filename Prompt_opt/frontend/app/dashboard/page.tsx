import Link from "next/link";
import { FileText, MessageSquare } from "lucide-react";
import EvaluationCard from "@/components/evaluate/EvaluateCard";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const evaluations = await prisma.evaluation.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Welcome to Promptly
        </h1>
        <p className="text-sm text-muted mt-1">
          Your AI prompt engineering workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/dashboard/prompts"
          className="flex flex-col gap-3 p-5 rounded-2xl border border-border bg-surface hover:border-primary/30 hover:bg-primary/5 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <FileText size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              Prompt Management
            </p>
            <p className="text-xs text-muted mt-0.5">
              Create, activate, and manage prompt versions
            </p>
          </div>
        </Link>

        <Link
          href="/chat"
          className="flex flex-col gap-3 p-5 rounded-2xl border border-border bg-surface hover:border-accent/30 hover:bg-accent/5 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
            <MessageSquare size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
              Chat Playground
            </p>
            <p className="text-xs text-muted mt-0.5">
              Test your active prompt in the chat interface
            </p>
          </div>
        </Link>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Recent Evaluations
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Latest feedback generated from your conversations
          </p>
        </div>

        {evaluations.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-5 text-sm text-muted">
            No evaluations yet. Run a conversation through the evaluator to see
            results here.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {evaluations.map((evaluation) => (
              <EvaluationCard
                key={evaluation.id}
                score={evaluation.score}
                feedback={evaluation.feedback}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
