-- AlterTable
ALTER TABLE "StaffEmploymentDetails" ADD COLUMN     "staffSignature" TEXT,
ADD COLUMN     "staffSignedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "StaffEmploymentWelcomeAck" ADD COLUMN     "staffSignature" TEXT,
ADD COLUMN     "staffSignedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "StaffSupportWorker" (
    "id" SERIAL NOT NULL,
    "staffId" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "staffSignature" TEXT,
    "staffSignedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffSupportWorker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StaffSupportWorker_staffId_key" ON "StaffSupportWorker"("staffId");

-- AddForeignKey
ALTER TABLE "StaffSupportWorker" ADD CONSTRAINT "StaffSupportWorker_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
