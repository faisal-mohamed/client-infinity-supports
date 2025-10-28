/*
  Warnings:

  - You are about to drop the column `isSigned` on the `FormSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `signature` on the `FormSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `signedAt` on the `FormSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `signedBy` on the `FormSubmission` table. All the data in the column will be lost.
  - Made the column `batchId` on table `FormAssignment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "FormAssignment" DROP CONSTRAINT "FormAssignment_batchId_fkey";

-- AlterTable
ALTER TABLE "FormAssignment" ALTER COLUMN "batchId" SET NOT NULL;

-- AlterTable
ALTER TABLE "FormBatch" ADD COLUMN     "isSigned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "signature" TEXT,
ADD COLUMN     "signedAt" TIMESTAMP(3),
ADD COLUMN     "signedBy" TEXT;

-- AlterTable
ALTER TABLE "FormSubmission" DROP COLUMN "isSigned",
DROP COLUMN "signature",
DROP COLUMN "signedAt",
DROP COLUMN "signedBy";

-- AddForeignKey
ALTER TABLE "FormAssignment" ADD CONSTRAINT "FormAssignment_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "FormBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
