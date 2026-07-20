import { PenLine, Sparkles, GitCompare, Rocket, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  step: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    icon: PenLine,
    step: "01",
    title: "Draft",
    description: "Bring a rough instruction or an existing prompt into the workspace.",
  },
  {
    icon: Sparkles,
    step: "02",
    title: "Optimize",
    description: "Promptly restructures it with roles, constraints, and clear formatting.",
  },
  {
    icon: GitCompare,
    step: "03",
    title: "Compare",
    description: "Generate variants and keep the version that reads and performs best.",
  },
  {
    icon: Rocket,
    step: "04",
    title: "Ship",
    description: "Copy the final prompt into your app with confidence.",
  },
];

export function Architecture() {
  return (
    <section id="architecture" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(60%_50%_at_50%_50%,black,transparent)]" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-accent">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            A simple, repeatable pipeline
          </h2>
          <p className="mt-4 text-pretty text-muted">
            From messy idea to production-ready prompt in four steps.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-4">
          {STEPS.map(({ icon: Icon, step, title, description }, i) => (
            <div key={step} className="relative">
              <div className="h-full rounded-2xl border border-border bg-surface/60 p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-sm text-muted/60">{step}</span>
                </div>
                <h3 className="mt-5 text-base font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
              </div>

              {i < STEPS.length - 1 && (
                <ArrowRight className="absolute top-1/2 -right-3 z-10 hidden h-5 w-5 -translate-y-1/2 text-muted/40 md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
