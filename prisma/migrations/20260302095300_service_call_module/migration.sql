-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('PENDING', 'UNDER_OBSERVATION', 'RESOLVED');

-- CreateTable
CREATE TABLE "ServiceCall" (
    "id" SERIAL NOT NULL,
    "problem" TEXT NOT NULL,
    "errorCode" TEXT,
    "status" "CallStatus" NOT NULL DEFAULT 'PENDING',
    "deviceId" INTEGER NOT NULL,
    "engineerId" INTEGER,
    "officeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceCall_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ServiceCall" ADD CONSTRAINT "ServiceCall_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceCall" ADD CONSTRAINT "ServiceCall_engineerId_fkey" FOREIGN KEY ("engineerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
