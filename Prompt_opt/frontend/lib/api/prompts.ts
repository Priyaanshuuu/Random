import type { PromptVersion } from "@/lib/types";
import { apiFetch } from "./client";

export function fetchPrompts(signal?: AbortSignal) {
  return apiFetch<PromptVersion[]>("/api/prompts", { signal });
}

export function createPrompt(prompt: string) {
  return apiFetch<PromptVersion>("/api/prompts", {
    method: "POST",
    body: { prompt },
  });
}

export function activatePrompt(id: string) {
  return apiFetch<PromptVersion>(`/api/prompts/${id}`, { method: "PATCH" });
}

export function deletePrompt(id: string) {
  return apiFetch<{ success: true }>(`/api/prompts/${id}`, {
    method: "DELETE",
  });
}

/** Generates a new, inactive prompt version from the given prompt's feedback. */
export function optimizePrompt(promptId: string) {
  return apiFetch<PromptVersion>("/api/optimize", {
    method: "POST",
    body: { promptId },
  });
}
