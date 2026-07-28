import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { APP_NAME, PROVIDER_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="relative">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-surface bg-glow px-6 py-16 text-center sm:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Ready to optimize your first prompt?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
            Jump straight into the workspace — no setup required.
          </p>
          <div className="mt-8 flex justify-center">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Open the app
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-6xl border-t border-border px-6 py-10">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
              <Sparkles className="size-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight">
              {APP_NAME}
            </span>
          </Link>

          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a
              href="#architecture"
              className="transition-colors hover:text-foreground"
            >
              Architecture
            </a>
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
          </nav>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} {APP_NAME}. Inference by {PROVIDER_NAME}.
        </p>
      </div>
    </footer>
  );
}
