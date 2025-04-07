/*
  Warnings:

  - A unique constraint covering the columns `[responseId]` on the table `Request` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[historyId]` on the table `Request` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_requestId_fkey";

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_requestId_fkey";

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "historyId" TEXT,
ADD COLUMN     "responseId" TEXT;

-- AlterTable
ALTER TABLE "Response" ADD COLUMN     "statusText" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Request_responseId_key" ON "Request"("responseId");

-- CreateIndex
CREATE UNIQUE INDEX "Request_historyId_key" ON "Request"("historyId");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "History"("id") ON DELETE SET NULL ON UPDATE CASCADE;
