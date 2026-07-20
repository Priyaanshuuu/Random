import Link from "next/link";
import { Sparkles, ArrowRight, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function LandingNavbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-2xl border border-border/70 bg-surface/70 px-4 py-2.5 backdrop-blur-xl sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold tracking-tight">Promptly</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a
            href="#architecture"
            className="transition-colors hover:text-foreground"
          >
            Architecture
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Docs
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#"
            aria-label="GitHub"
            className="hidden h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-foreground sm:flex"
          >
            <Code2 className="h-4 w-4" />
          </a>
          <Link href="/chat">
            <Button size="sm">
              Open App
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
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
            <Sparkles className="h-3.5 w-3.5" />
            Evaluation-first prompt engineering
          </Badge>
        </div>

        <h1 className="animate-fade-up text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
          Optimize prompts like
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            {" "}
            production software
          </span>
        </h1>

        <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-muted sm:text-lg">
          Promptly is the workspace for designing, versioning, and refining LLM
          prompts. Iterate in a familiar chat interface and ship prompts you can
          actually trust.
        </p>

        <div className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/chat" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto">
              Start optimizing
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href="#features" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Explore features
            </Button>
          </a>
        </div>

        <p className="mt-6 text-xs text-muted/70">
          No credit card required · Free during beta
        </p>
      </div>
    </section>
  );
}
