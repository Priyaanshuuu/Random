import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";

export async function chat(message: string) {
  // Get active prompt
  const prompt = await prisma.promptVersion.findFirst({
    where: { isActive: true },
  });

  if (!prompt) throw new Error("No active prompt");

  // Ask OpenAI
  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: prompt.prompt,
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  const answer = completion.choices[0].message.content ?? "";

  // Create conversation
  const conversation = await prisma.conversation.create({
    data: {
      promptVersionId: prompt.id,
    },
  });

  // Save messages
  await prisma.message.createMany({
    data: [
      {
        role: "user",
        content: message,
        conversationId: conversation.id,
      },
      {
        role: "assistant",
        content: answer,
        conversationId: conversation.id,
      },
    ],
  });

  return {
    conversationId: conversation.id,
    answer,
  };
}