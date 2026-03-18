/*
  Warnings:

  - The `category` column on the `Device` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `processor` column on the `Device` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `problem` on the `ServiceCall` table. All the data in the column will be lost.
  - The `status` column on the `ServiceCall` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `type` column on the `WorkImage` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "SparePart" DROP CONSTRAINT "SparePart_workUpdateId_fkey";

-- DropForeignKey
ALTER TABLE "WorkImage" DROP CONSTRAINT "WorkImage_workUpdateId_fkey";

-- DropForeignKey
ALTER TABLE "WorkUpdate" DROP CONSTRAINT "WorkUpdate_serviceCallId_fkey";

-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "address" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "city" TEXT,
ADD COLUMN     "contactPerson" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "zipCode" TEXT;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "address" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "city" TEXT,
ADD COLUMN     "contactPerson" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "taxId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "zipCode" TEXT;

-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "installationDate" TIMESTAMP(3),
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "purchaseOrderNumber" TEXT,
ADD COLUMN     "purchasePrice" DOUBLE PRECISION,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "warrantyExpiry" TIMESTAMP(3),
DROP COLUMN "category",
ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'OTHER',
DROP COLUMN "processor",
ADD COLUMN     "processor" TEXT;

-- AlterTable
ALTER TABLE "ServiceCall" DROP COLUMN "problem",
ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "resolutionNotes" TEXT,
ADD COLUMN     "resolvedDate" TIMESTAMP(3),
ADD COLUMN     "scheduledDate" TIMESTAMP(3),
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'Issue',
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "SparePart" ADD COLUMN     "cost" DOUBLE PRECISION,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'ENGINEER';

-- AlterTable
ALTER TABLE "WorkImage" ADD COLUMN     "caption" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT;

-- AlterTable
ALTER TABLE "WorkUpdate" ADD COLUMN     "hoursWorked" DOUBLE PRECISION,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropEnum
DROP TYPE "CallStatus";

-- DropEnum
DROP TYPE "DeviceCategory";

-- DropEnum
DROP TYPE "ImageType";

-- DropEnum
DROP TYPE "ProcessorType";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Office" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Office_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" INTEGER,
    "changes" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ActivityLog_userId_idx" ON "ActivityLog"("userId");

-- CreateIndex
CREATE INDEX "ActivityLog_action_idx" ON "ActivityLog"("action");

-- CreateIndex
CREATE INDEX "ActivityLog_entityType_entityId_idx" ON "ActivityLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE INDEX "Branch_customerId_idx" ON "Branch"("customerId");

-- CreateIndex
CREATE INDEX "Branch_officeId_idx" ON "Branch"("officeId");

-- CreateIndex
CREATE INDEX "Customer_officeId_idx" ON "Customer"("officeId");

-- CreateIndex
CREATE INDEX "Customer_name_idx" ON "Customer"("name");

-- CreateIndex
CREATE INDEX "Device_serialNumber_idx" ON "Device"("serialNumber");

-- CreateIndex
CREATE INDEX "Device_branchId_idx" ON "Device"("branchId");

-- CreateIndex
CREATE INDEX "Device_officeId_idx" ON "Device"("officeId");

-- CreateIndex
CREATE INDEX "Device_status_idx" ON "Device"("status");

-- CreateIndex
CREATE INDEX "ServiceCall_deviceId_idx" ON "ServiceCall"("deviceId");

-- CreateIndex
CREATE INDEX "ServiceCall_engineerId_idx" ON "ServiceCall"("engineerId");

-- CreateIndex
CREATE INDEX "ServiceCall_officeId_idx" ON "ServiceCall"("officeId");

-- CreateIndex
CREATE INDEX "ServiceCall_status_idx" ON "ServiceCall"("status");

-- CreateIndex
CREATE INDEX "ServiceCall_priority_idx" ON "ServiceCall"("priority");

-- CreateIndex
CREATE INDEX "SparePart_workUpdateId_idx" ON "SparePart"("workUpdateId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_officeId_idx" ON "User"("officeId");

-- CreateIndex
CREATE INDEX "WorkImage_workUpdateId_idx" ON "WorkImage"("workUpdateId");

-- CreateIndex
CREATE INDEX "WorkUpdate_serviceCallId_idx" ON "WorkUpdate"("serviceCallId");

-- CreateIndex
CREATE INDEX "WorkUpdate_engineerId_idx" ON "WorkUpdate"("engineerId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceCall" ADD CONSTRAINT "ServiceCall_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkUpdate" ADD CONSTRAINT "WorkUpdate_serviceCallId_fkey" FOREIGN KEY ("serviceCallId") REFERENCES "ServiceCall"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SparePart" ADD CONSTRAINT "SparePart_workUpdateId_fkey" FOREIGN KEY ("workUpdateId") REFERENCES "WorkUpdate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkImage" ADD CONSTRAINT "WorkImage_workUpdateId_fkey" FOREIGN KEY ("workUpdateId") REFERENCES "WorkUpdate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
