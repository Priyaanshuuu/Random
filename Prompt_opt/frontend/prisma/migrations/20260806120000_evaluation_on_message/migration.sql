-- Re-key Evaluation from Conversation to the assistant Message it scores, so
-- every turn in a multi-turn thread can be judged independently.
--
-- Existing rows are backfilled: until now each Conversation held exactly one
-- user/assistant pair, so its first assistant message is the one that was scored.

-- AlterTable
ALTER TABLE "Evaluation" ADD COLUMN "messageId" TEXT;

-- Backfill from the assistant message of the scored conversation.
UPDATE "Evaluation" e
SET "messageId" = (
    SELECT m."id"
    FROM "Message" m
    WHERE m."conversationId" = e."conversationId"
      AND m."role" = 'assistant'
    ORDER BY m."createdAt" ASC
    LIMIT 1
);

-- Drop evaluations whose conversation has no assistant message to point at.
DELETE FROM "Evaluation" WHERE "messageId" IS NULL;

-- AlterTable
ALTER TABLE "Evaluation" ALTER COLUMN "messageId" SET NOT NULL;

-- DropForeignKey
ALTER TABLE "Evaluation" DROP CONSTRAINT "Evaluation_conversationId_fkey";

-- DropIndex
DROP INDEX "Evaluation_conversationId_key";

-- AlterTable
ALTER TABLE "Evaluation" DROP COLUMN "conversationId";

-- CreateIndex
CREATE UNIQUE INDEX "Evaluation_messageId_key" ON "Evaluation"("messageId");

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");

-- Existing rows were inserted by a single createMany, so a conversation's user
-- and assistant messages share a timestamp and their order is ambiguous. Nudge
-- the assistant side forward so replayed transcripts keep question-then-answer.
UPDATE "Message"
SET "createdAt" = "createdAt" + INTERVAL '1 millisecond'
WHERE "role" = 'assistant';
