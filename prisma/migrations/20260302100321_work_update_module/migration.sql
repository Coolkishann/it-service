-- CreateTable
CREATE TABLE "WorkUpdate" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "serviceCallId" INTEGER NOT NULL,
    "engineerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SparePart" (
    "id" SERIAL NOT NULL,
    "partName" TEXT NOT NULL,
    "capacity" TEXT,
    "oldSerial" TEXT,
    "newSerial" TEXT,
    "workUpdateId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SparePart_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkUpdate" ADD CONSTRAINT "WorkUpdate_serviceCallId_fkey" FOREIGN KEY ("serviceCallId") REFERENCES "ServiceCall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkUpdate" ADD CONSTRAINT "WorkUpdate_engineerId_fkey" FOREIGN KEY ("engineerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SparePart" ADD CONSTRAINT "SparePart_workUpdateId_fkey" FOREIGN KEY ("workUpdateId") REFERENCES "WorkUpdate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
