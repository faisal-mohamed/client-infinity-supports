-- AlterTable
ALTER TABLE "FormBatch" ADD COLUMN     "adminNotified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "MasterForm" ADD COLUMN     "requiresSignature" BOOLEAN;
