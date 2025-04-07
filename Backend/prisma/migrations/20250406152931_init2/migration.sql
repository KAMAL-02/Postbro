/*
  Warnings:

  - You are about to drop the column `collectionId` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the `Collection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_userId_fkey";

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_collectionId_fkey";

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "collectionId",
DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "title" TEXT;

-- DropTable
DROP TABLE "Collection";
