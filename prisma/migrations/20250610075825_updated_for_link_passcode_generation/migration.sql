-- AlterTable
ALTER TABLE "FormAssignment" ADD COLUMN     "batchId" INTEGER,
ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isCommonFieldsCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passcode" TEXT;

-- CreateTable
CREATE TABLE "FormBatch" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "batchToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormBatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FormBatch_batchToken_key" ON "FormBatch"("batchToken");

-- AddForeignKey
ALTER TABLE "FormBatch" ADD CONSTRAINT "FormBatch_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAssignment" ADD CONSTRAINT "FormAssignment_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "FormBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
