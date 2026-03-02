-- CreateEnum
CREATE TYPE "DeviceCategory" AS ENUM ('LAPTOP', 'DESKTOP', 'PRINTER', 'AIO');

-- CreateEnum
CREATE TYPE "ProcessorType" AS ENUM ('INTEL_I3', 'INTEL_I5', 'INTEL_I7', 'AMD_RYZEN5', 'AMD_RYZEN7');

-- CreateTable
CREATE TABLE "Device" (
    "id" SERIAL NOT NULL,
    "category" "DeviceCategory" NOT NULL,
    "company" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "ram" TEXT,
    "storage" TEXT,
    "os" TEXT,
    "motherboardName" TEXT,
    "motherboardSerial" TEXT,
    "processor" "ProcessorType",
    "branchId" INTEGER NOT NULL,
    "officeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Device_serialNumber_key" ON "Device"("serialNumber");

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
