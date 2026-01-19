-- AlterTable
ALTER TABLE "FormAssignment" ADD COLUMN "instanceNumber" INTEGER NOT NULL DEFAULT 1;

-- DropIndex
DROP INDEX IF EXISTS "FormAssignment_clientId_formId_formVersion_key";

-- CreateIndex
CREATE UNIQUE INDEX "FormAssignment_clientId_formId_formVersion_instanceNumber_key" ON "FormAssignment"("clientId", "formId", "formVersion", "instanceNumber");
