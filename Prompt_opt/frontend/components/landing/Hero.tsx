import Link from "next/link";
import { ArrowRight, Code2, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { APP_NAME, PROVIDER_NAME } from "@/lib/constants";

function LandingNavbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4">
      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-2xl border border-border/70 bg-surface/70 px-4 py-2.5 backdrop-blur-xl sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
            <Sparkles className="size-4" />
          </span>
          <span className="text-sm font-semibold tracking-tight">
            {APP_NAME}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a
            href="#architecture"
            className="transition-colors hover:text-foreground"
          >
            Architecture
          </a>
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle className="hidden sm:inline-flex" />
          <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
            <a href="#architecture" aria-label="How it works">
              <Code2 />
            </a>
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard">
              Open app
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-glow">
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />
      <LandingNavbar />

      <div className="relative mx-auto max-w-4xl px-6 pt-40 pb-24 text-center sm:pt-48">
        <div className="mb-6 flex justify-center">
          <Badge variant="primary" className="animate-fade-up px-3 py-1.5">
            <Sparkles />
            Evaluation-first prompt engineering
          </Badge>
        </div>

        <h1 className="animate-fade-up text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-6xl">
          Optimize prompts like
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            {" "}
            production software
          </span>
        </h1>

        <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-base leading-7 text-pretty text-muted-foreground sm:text-lg">
          {APP_NAME} is the workspace for designing, versioning, and refining
          LLM prompts. Test in a familiar chat interface, score the results, and
          let the feedback write your next version.
        </p>

        <div className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" asChild className="w-full sm:w-auto">
            <Link href="/dashboard">
              Start optimizing
              <ArrowRight />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
            <a href="#features">Explore features</a>
          </Button>
        </div>

        <p className="mt-6 text-xs text-muted-foreground/70">
          Running on {PROVIDER_NAME} · Open source
        </p>
      </div>
    </section>
  );
}
