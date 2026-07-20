// Static dummy data for the UI. No backend, no APIs — display only.

export type Role = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: string; // human label, e.g. "2h ago"
  messages: ChatMessage[];
}

export interface ModelOption {
  id: string;
  label: string;
}

export const MODELS: ModelOption[] = [
  { id: "gpt-4o", label: "GPT-4o" },
  { id: "gpt-4o-mini", label: "GPT-4o mini" },
  { id: "o3", label: "o3" },
  { id: "claude-opus-4", label: "Claude Opus 4" },
];

export const ACTIVE_MODEL = MODELS[0];
export const ACTIVE_PROMPT_VERSION = "v3";

const SAMPLE_ASSISTANT_MARKDOWN = `Here's an **optimized** version of your prompt. I tightened the role framing and added explicit output constraints.

### What changed
- Added a clear persona and scope
- Requested step-by-step reasoning
- Constrained the output format

\`\`\`ts
// Example: calling the model with the improved prompt
const response = await client.chat.completions.create({
  model: "gpt-4o",
  temperature: 0.4,
  messages: [
    { role: "system", content: OPTIMIZED_PROMPT },
    { role: "user", content: userInput },
  ],
});
\`\`\`

> Tip: keep the temperature low for deterministic, evaluation-friendly outputs.

Want me to generate a couple of A/B variants next?`;

export const CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    title: "Optimize onboarding email prompt",
    updatedAt: "2h ago",
    messages: [
      {
        id: "m1",
        role: "user",
        content:
          "Rewrite this prompt so the model returns a friendlier onboarding email: 'Write an onboarding email.'",
      },
      {
        id: "m2",
        role: "assistant",
        content: SAMPLE_ASSISTANT_MARKDOWN,
      },
      {
        id: "m3",
        role: "user",
        content: "Can you make it more concise and add a subject line?",
      },
    ],
  },
  {
    id: "c2",
    title: "Summarization system prompt v2",
    updatedAt: "Yesterday",
    messages: [
      {
        id: "m1",
        role: "user",
        content: "Improve my summarization system prompt for long transcripts.",
      },
    ],
  },
  {
    id: "c3",
    title: "Classifier few-shot examples",
    updatedAt: "Yesterday",
    messages: [],
  },
  {
    id: "c4",
    title: "Reduce hallucinations in RAG answers",
    updatedAt: "3d ago",
    messages: [],
  },
  {
    id: "c5",
    title: "Tone: professional → conversational",
    updatedAt: "Last week",
    messages: [],
  },
];

export const SUGGESTED_PROMPTS: string[] = [
  "Optimize a system prompt for customer support",
  "Turn this instruction into a few-shot prompt",
  "Reduce token usage without losing quality",
  "Generate two A/B variants of my prompt",
];
