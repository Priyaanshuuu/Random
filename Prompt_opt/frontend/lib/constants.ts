/** Static, provider-facing constants surfaced in the UI. */

export const APP_NAME = "Promptly";

export const APP_TAGLINE =
  "Design, test, and optimize production-grade prompts with an evaluation-first workflow.";

/** The inference provider powering chat, evaluation, and optimization. */
export const PROVIDER_NAME = "Groq";

/**
 * Model used by the server-side services. Mirrored here purely for display —
 * the value that actually runs inference lives in `app/services/*`.
 */
export const ACTIVE_MODEL = {
  id: "llama-3.3-70b-versatile",
  label: "Llama 3.3 70B",
} as const;

export const SUGGESTED_PROMPTS = [
  "Optimize a system prompt for customer support",
  "Turn this instruction into a few-shot prompt",
  "Reduce token usage without losing quality",
  "Generate two A/B variants of my prompt",
] as const;

/** Score bands used to color evaluation results. */
export const SCORE_BANDS = [
  { min: 80, label: "Strong", tone: "success" },
  { min: 60, label: "Adequate", tone: "warning" },
  { min: 0, label: "Needs work", tone: "destructive" },
] as const;
