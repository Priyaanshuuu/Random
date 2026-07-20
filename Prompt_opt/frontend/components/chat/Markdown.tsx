"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

function CodeBlock({
  language,
  code,
}: {
  language: string | null;
  code: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-border bg-[#0c0c0f]">
      <div className="flex items-center justify-between border-b border-border bg-surface-2/60 px-4 py-2">
        <span className="font-mono text-xs text-muted">{language ?? "code"}</span>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted transition-colors hover:bg-surface hover:text-foreground"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono text-foreground/90">{code}</code>
      </pre>
    </div>
  );
}

/** Renders assistant messages as GitHub-flavored markdown with styled code. */
export function Markdown({ content }: { content: string }) {
  return (
    <div className="text-[15px] leading-7 text-foreground/90">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ className, ...p }) => (
            <h1 className={cn("mt-6 mb-3 text-xl font-semibold", className)} {...p} />
          ),
          h2: ({ className, ...p }) => (
            <h2 className={cn("mt-6 mb-3 text-lg font-semibold", className)} {...p} />
          ),
          h3: ({ className, ...p }) => (
            <h3 className={cn("mt-5 mb-2 text-base font-semibold", className)} {...p} />
          ),
          p: ({ className, ...p }) => (
            <p className={cn("my-3 first:mt-0 last:mb-0", className)} {...p} />
          ),
          ul: ({ className, ...p }) => (
            <ul className={cn("my-3 list-disc space-y-1.5 pl-5", className)} {...p} />
          ),
          ol: ({ className, ...p }) => (
            <ol className={cn("my-3 list-decimal space-y-1.5 pl-5", className)} {...p} />
          ),
          li: ({ className, ...p }) => (
            <li className={cn("marker:text-muted", className)} {...p} />
          ),
          a: ({ className, ...p }) => (
            <a
              className={cn("text-primary underline underline-offset-2 hover:text-primary/80", className)}
              target="_blank"
              rel="noreferrer"
              {...p}
            />
          ),
          blockquote: ({ className, ...p }) => (
            <blockquote
              className={cn(
                "my-4 border-l-2 border-primary/50 bg-surface-2/40 px-4 py-2 text-muted italic",
                className,
              )}
              {...p}
            />
          ),
          strong: ({ className, ...p }) => (
            <strong className={cn("font-semibold text-foreground", className)} {...p} />
          ),
          hr: ({ className, ...p }) => (
            <hr className={cn("my-6 border-border", className)} {...p} />
          ),
          table: ({ className, ...p }) => (
            <div className="my-4 overflow-x-auto">
              <table
                className={cn("w-full border-collapse text-sm", className)}
                {...p}
              />
            </div>
          ),
          th: ({ className, ...p }) => (
            <th
              className={cn("border border-border bg-surface-2/60 px-3 py-2 text-left font-medium", className)}
              {...p}
            />
          ),
          td: ({ className, ...p }) => (
            <td className={cn("border border-border px-3 py-2", className)} {...p} />
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className ?? "");
            const raw = String(children).replace(/\n$/, "");

            // Fenced block: has a language- className.
            if (match) {
              return <CodeBlock language={match[1]} code={raw} />;
            }

            // Multi-line fenced block with no language.
            if (raw.includes("\n")) {
              return <CodeBlock language={null} code={raw} />;
            }

            // Inline code.
            return (
              <code
                className="rounded-md border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-accent"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
