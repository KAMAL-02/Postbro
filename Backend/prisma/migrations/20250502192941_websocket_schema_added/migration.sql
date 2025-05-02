-- CreateEnum
CREATE TYPE "MessageDirection" AS ENUM ('sent', 'received');

-- CreateTable
CREATE TABLE "RealTimeSession" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "userId" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "messageCountSent" INTEGER NOT NULL DEFAULT 0,
    "messageCountReceived" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RealTimeSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RealTimeMessage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "direction" "MessageDirection" NOT NULL,
    "data" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RealTimeMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RealTimeSession" ADD CONSTRAINT "RealTimeSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RealTimeMessage" ADD CONSTRAINT "RealTimeMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "RealTimeSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
