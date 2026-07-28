import { prisma } from "@/lib/prisma";
import { groq } from "@/lib/groq";

export async function optimizePrompt(promptId: string) {
  const prompt = await prisma.promptVersion.findUnique({
    where: {
      id: promptId,
    },
  });

  if (!prompt) {
    throw new Error("Prompt not found");
  }

  const evaluations = await prisma.evaluation.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  const feedback = evaluations
    .map((e) => `Score: ${e.score}\nFeedback: ${e.feedback}`)
    .join("\n\n");

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `
You improve system prompts.

Return ONLY the improved prompt.

Current Prompt:

${prompt.prompt}

Recent Feedback:

${feedback}
`,
      },
    ],
  });

  const improvedPrompt =
    completion.choices[0].message.content ?? prompt.prompt;

  const latest = await prisma.promptVersion.findFirst({
    orderBy: {
      version: "desc",
    },
  });

  return prisma.promptVersion.create({
    data: {
      version: (latest?.version ?? 0) + 1,
      prompt: improvedPrompt,
      isActive: false,
    },
  });
}