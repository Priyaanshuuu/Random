import { prisma } from "@/lib/prisma";

export async function getPrompts() {
  return prisma.promptVersion.findMany({
    orderBy: {
      version: "desc",
    },
  });
}

export async function createPrompt(prompt: string) {
  const latest = await prisma.promptVersion.findFirst({
    orderBy: {
      version: "desc",
    },
  });

  return prisma.promptVersion.create({
    data: {
      version: (latest?.version ?? 0) + 1,
      prompt,
      isActive: false,
    },
  });
}

export async function activatePrompt(id: string) {
  await prisma.promptVersion.updateMany({
    data: {
      isActive: false,
    },
  });

  return prisma.promptVersion.update({
    where: { id },
    data: {
      isActive: true,
    },
  });
}

export async function deletePrompt(id: string) {
  return prisma.promptVersion.delete({
    where: { id },
  });
}