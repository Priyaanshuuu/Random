export interface PromptVersion {
  id: string;
  version: number;
  prompt: string;
  isActive: boolean;
  createdAt: string;
}

export async function fetchPrompts(): Promise<PromptVersion[]> {
  const res = await fetch("/api/prompts", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch prompts");
  return res.json();
}

export async function createPrompt(prompt: string): Promise<PromptVersion> {
  const res = await fetch("/api/prompts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error("Failed to create prompt");
  return res.json();
}

export async function activatePrompt(id: string): Promise<PromptVersion> {
  const res = await fetch(`/api/prompts/${id}`, { method: "PATCH" });
  if (!res.ok) throw new Error("Failed to activate prompt");
  return res.json();
}

export async function deletePromptById(id: string): Promise<void> {
  const res = await fetch(`/api/prompts/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete prompt");
}
