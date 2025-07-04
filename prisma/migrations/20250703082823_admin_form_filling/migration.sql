/*
  Warnings:

  - You are about to drop the column `isSigned` on the `FormBatch` table. All the data in the column will be lost.
  - You are about to drop the column `signature` on the `FormBatch` table. All the data in the column will be lost.
  - You are about to drop the column `signedAt` on the `FormBatch` table. All the data in the column will be lost.
  - You are about to drop the column `signedBy` on the `FormBatch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FormBatch" DROP COLUMN "isSigned",
DROP COLUMN "signature",
DROP COLUMN "signedAt",
DROP COLUMN "signedBy",
ADD COLUMN     "isSignatureOnly" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "FormSubmission" ADD COLUMN     "adminFilledAt" TIMESTAMP(3),
ADD COLUMN     "clientSignature" TEXT,
ADD COLUMN     "clientSignedAt" TIMESTAMP(3),
ADD COLUMN     "filledByAdmin" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "SignatureBatchForm" (
    "id" SERIAL NOT NULL,
    "batchId" INTEGER NOT NULL,
    "formSubmissionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SignatureBatchForm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SignatureBatchForm_batchId_formSubmissionId_key" ON "SignatureBatchForm"("batchId", "formSubmissionId");

-- AddForeignKey
ALTER TABLE "SignatureBatchForm" ADD CONSTRAINT "SignatureBatchForm_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "FormBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignatureBatchForm" ADD CONSTRAINT "SignatureBatchForm_formSubmissionId_fkey" FOREIGN KEY ("formSubmissionId") REFERENCES "FormSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
