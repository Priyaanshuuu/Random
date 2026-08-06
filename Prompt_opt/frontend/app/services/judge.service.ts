import { prisma } from "@/lib/prisma";
import { groq } from "@/lib/groq";
import { ACTIVE_MODEL } from "@/lib/constants";

const JUDGE_SYSTEM_PROMPT = `You are an AI judge.

Score how well the answer responds to the question, given the conversation so far.

Return ONLY a JSON object of the form:
{"score": <integer 0-100>, "feedback": "<one or two sentences>"}`;

interface Verdict {
  score: number;
  feedback: string;
}

/**
 * Scores a single assistant message and stores the verdict.
 *
 * Re-running on the same message overwrites the previous verdict rather than
 * tripping the unique constraint.
 */
export async function evaluateMessage(messageId: string) {
  const message = await prisma.message.findUnique({
    where: { id: messageId },
    include: {
      conversation: {
        include: { messages: { orderBy: { createdAt: "asc" } } },
      },
    },
  });

  if (!message) throw new Error("Message not found");
  if (message.role !== "assistant") {
    throw new Error("Only assistant messages can be evaluated");
  }

  // Everything the assistant saw before answering, so the judge scores the
  // reply in context rather than against a single orphaned question.
  const turns = message.conversation.messages;
  const index = turns.findIndex((m) => m.id === message.id);

  const transcript = turns
    .slice(0, index)
    .map((m) => `${m.role === "assistant" ? "Assistant" : "User"}: ${m.content}`)
    .join("\n\n");

  const completion = await groq.chat.completions.create({
    model: ACTIVE_MODEL.id,
    // Guarantees parseable JSON instead of prose wrapped in a markdown fence.
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: JUDGE_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Conversation so far:\n${transcript}\n\nAnswer to score:\n${message.content}`,
      },
    ],
  });

  const verdict = parseVerdict(completion.choices[0].message.content);

  return prisma.evaluation.upsert({
    where: { messageId },
    create: { messageId, ...verdict },
    update: verdict,
  });
}

/**
 * Coerces the model's reply into a score/feedback pair. JSON mode makes
 * malformed output unlikely but not impossible, and the model can still return
 * a score outside the documented range.
 */
function parseVerdict(content: string | null): Verdict {
  let data: unknown;
  try {
    data = JSON.parse(content ?? "");
  } catch {
    throw new Error("Judge did not return valid JSON");
  }

  if (typeof data !== "object" || data === null) {
    throw new Error("Judge did not return a JSON object");
  }

  const { score, feedback } = data as Record<string, unknown>;

  const numericScore = typeof score === "string" ? Number(score) : score;
  if (typeof numericScore !== "number" || !Number.isFinite(numericScore)) {
    throw new Error("Judge response is missing a numeric score");
  }

  if (typeof feedback !== "string" || feedback.trim() === "") {
    throw new Error("Judge response is missing feedback");
  }

  return {
    score: Math.max(0, Math.min(100, Math.round(numericScore))),
    feedback: feedback.trim(),
  };
}
