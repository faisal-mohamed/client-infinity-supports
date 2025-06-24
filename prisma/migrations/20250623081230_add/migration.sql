/*
  Warnings:

  - You are about to drop the `FormSignature` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FormSignature" DROP CONSTRAINT "FormSignature_clientId_fkey";

-- AlterTable
ALTER TABLE "FormSubmission" ADD COLUMN     "isSigned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "signature" TEXT,
ADD COLUMN     "signedAt" TIMESTAMP(3),
ADD COLUMN     "signedBy" TEXT;

-- DropTable
DROP TABLE "FormSignature";
