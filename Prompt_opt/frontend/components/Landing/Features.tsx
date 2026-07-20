import {
  Wand2,
  GitBranch,
  MessagesSquare,
  Gauge,
  ShieldCheck,
  Blocks,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Wand2,
    title: "One-click optimization",
    description:
      "Turn vague instructions into structured, high-performing prompts with clear roles, constraints, and formats.",
  },
  {
    icon: GitBranch,
    title: "Prompt versioning",
    description:
      "Every change is tracked. Compare versions and roll back to the one that performed best.",
  },
  {
    icon: MessagesSquare,
    title: "Chat-native workflow",
    description:
      "Iterate on prompts in a familiar conversational interface — no context switching, no clutter.",
  },
  {
    icon: Gauge,
    title: "Built for speed",
    description:
      "A snappy, keyboard-friendly UI that keeps you in flow while you refine and test.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable outputs",
    description:
      "Encourage deterministic, evaluation-friendly responses with sensible defaults baked in.",
  },
  {
    icon: Blocks,
    title: "Composable variants",
    description:
      "Generate A/B variants of any prompt and keep the winners in your library.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">Features</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need to ship better prompts
          </h2>
          <p className="mt-4 text-pretty text-muted">
            A focused toolkit for prompt engineers who treat prompts as
            first-class artifacts.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group relative rounded-2xl border border-border bg-surface/50 p-6 transition-colors hover:border-primary/40 hover:bg-surface"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 text-primary ring-1 ring-border transition-colors group-hover:ring-primary/40">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
