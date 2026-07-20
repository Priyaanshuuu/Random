import Link from "next/link";
import { Sparkles, ArrowRight, Send, Code2, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="relative">
      {/* CTA */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-surface bg-glow px-6 py-16 text-center sm:px-16">
          <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to optimize your first prompt?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-muted">
            Jump straight into the workspace — no setup required.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/chat">
              <Button size="lg">
                Open the app
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto mt-20 max-w-6xl border-t border-border px-6 py-10">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight">Promptly</span>
          </Link>

          <nav className="flex items-center gap-6 text-sm text-muted">
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#architecture" className="transition-colors hover:text-foreground">
              Architecture
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Privacy
            </a>
          </nav>

          <div className="flex items-center gap-2">
            {[Send, Code2, AtSign].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-muted/60">
          © 2026 Promptly. Built for prompt engineers.
        </p>
      </div>
    </footer>
  );
}
