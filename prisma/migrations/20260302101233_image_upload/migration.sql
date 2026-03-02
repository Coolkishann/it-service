-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('BEFORE', 'AFTER');

-- CreateTable
CREATE TABLE "WorkImage" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "type" "ImageType" NOT NULL,
    "workUpdateId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkImage" ADD CONSTRAINT "WorkImage_workUpdateId_fkey" FOREIGN KEY ("workUpdateId") REFERENCES "WorkUpdate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
