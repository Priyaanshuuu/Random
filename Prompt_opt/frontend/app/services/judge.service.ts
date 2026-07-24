import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";

export async function evaluateConversation(conversationId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: true,
      promptVersion: true,
    },
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const userMessage = conversation.messages.find(
    (m) => m.role === "user"
  );

  const assistantMessage = conversation.messages.find(
    (m) => m.role === "assistant"
  );

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: `
You are an AI Judge.

Return ONLY valid JSON.

{
  "score":90,
  "feedback":"Good answer"
}
`,
      },
      {
        role: "user",
        content: `
Question:
${userMessage?.content}

Answer:
${assistantMessage?.content}
`,
      },
    ],
  });

  const result = JSON.parse(
    completion.choices[0].message.content || "{}"
  );

  return prisma.evaluation.create({
    data: {
      conversationId,
      score: result.score,
      feedback: result.feedback,
    },
  });
}