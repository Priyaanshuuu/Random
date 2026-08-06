import { prisma } from "@/lib/prisma";
import { groq } from "@/lib/groq";
import { ACTIVE_MODEL } from "@/lib/constants";
import { truncate } from "@/lib/utils";

/** Roles Groq accepts for the turns we replay from the database. */
type Turn = { role: "user" | "assistant"; content: string };

/**
 * Runs one chat turn against the active prompt version.
 *
 * When `conversationId` is supplied the turn is appended to that thread and the
 * whole history is replayed to the model, so the assistant actually remembers
 * earlier turns. Omitting it starts a new thread.
 */
export async function chat(message: string, conversationId?: string) {
  const conversation = conversationId
    ? await loadConversation(conversationId)
    : await startConversation(message);

  const history: Turn[] = conversation.messages.map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: m.content,
  }));

  const completion = await groq.chat.completions.create({
    model: ACTIVE_MODEL.id,
    messages: [
      { role: "system", content: conversation.promptVersion.prompt },
      ...history,
      { role: "user", content: message },
    ],
  });

  const answer = completion.choices[0].message.content ?? "";

  // Timestamps are set explicitly: both rows are written in one transaction, so
  // Postgres would otherwise stamp them with the same CURRENT_TIMESTAMP and the
  // turn order within the thread would be ambiguous.
  const askedAt = new Date();
  const answeredAt = new Date(askedAt.getTime() + 1);

  // Written together so a thread can never hold a question without its answer.
  const [, assistantMessage] = await prisma.$transaction([
    prisma.message.create({
      data: {
        role: "user",
        content: message,
        conversationId: conversation.id,
        createdAt: askedAt,
      },
    }),
    prisma.message.create({
      data: {
        role: "assistant",
        content: answer,
        conversationId: conversation.id,
        createdAt: answeredAt,
      },
    }),
  ]);

  return {
    conversationId: conversation.id,
    messageId: assistantMessage.id,
    answer,
  };
}

async function loadConversation(id: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      promptVersion: true,
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!conversation) throw new Error("Conversation not found");
  return conversation;
}

async function startConversation(message: string) {
  const prompt = await prisma.promptVersion.findFirst({
    where: { isActive: true },
  });

  if (!prompt) throw new Error("No active prompt");

  return prisma.conversation.create({
    data: {
      promptVersionId: prompt.id,
      title: truncate(message, 40),
    },
    include: {
      promptVersion: true,
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
}

/** Threads for the sidebar, newest first. */
export async function getConversations() {
  return prisma.conversation.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        include: { evaluation: true },
      },
    },
  });
}
