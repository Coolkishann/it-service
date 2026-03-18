/*
  Warnings:

  - You are about to drop the column `officeId` on the `Branch` table. All the data in the column will be lost.
  - You are about to drop the column `officeId` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `officeId` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `officeId` on the `ServiceCall` table. All the data in the column will be lost.
  - You are about to drop the column `officeId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Office` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Branch" DROP CONSTRAINT "Branch_officeId_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_officeId_fkey";

-- DropForeignKey
ALTER TABLE "Device" DROP CONSTRAINT "Device_officeId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceCall" DROP CONSTRAINT "ServiceCall_officeId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_officeId_fkey";

-- DropIndex
DROP INDEX "Branch_officeId_idx";

-- DropIndex
DROP INDEX "Customer_officeId_idx";

-- DropIndex
DROP INDEX "Device_officeId_idx";

-- DropIndex
DROP INDEX "ServiceCall_officeId_idx";

-- DropIndex
DROP INDEX "User_officeId_idx";

-- AlterTable
ALTER TABLE "Branch" DROP COLUMN "officeId";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "officeId";

-- AlterTable
ALTER TABLE "Device" DROP COLUMN "officeId";

-- AlterTable
ALTER TABLE "ServiceCall" DROP COLUMN "officeId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "officeId";

-- DropTable
DROP TABLE "Office";
