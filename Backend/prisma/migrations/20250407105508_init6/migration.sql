/*
  Warnings:

  - You are about to drop the column `historyId` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `responseId` on the `Request` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[requestId]` on the table `History` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[requestId]` on the table `Response` will be added. If there are existing duplicate values, this will fail.
  - Made the column `requestId` on table `History` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_historyId_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_responseId_fkey";

-- DropIndex
DROP INDEX "Request_historyId_key";

-- DropIndex
DROP INDEX "Request_responseId_key";

-- AlterTable
ALTER TABLE "History" ALTER COLUMN "requestId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "historyId",
DROP COLUMN "responseId";

-- CreateIndex
CREATE UNIQUE INDEX "History_requestId_key" ON "History"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "Response_requestId_key" ON "Response"("requestId");

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
