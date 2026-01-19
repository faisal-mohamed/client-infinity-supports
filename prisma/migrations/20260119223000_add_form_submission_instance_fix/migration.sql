-- AlterTable
ALTER TABLE "FormSubmission" ADD COLUMN "instanceNumber" INTEGER NOT NULL DEFAULT 1;

-- DropIndex
DROP INDEX IF EXISTS "FormSubmission_clientId_formId_formVersion_key";

-- CreateIndex
CREATE UNIQUE INDEX "FormSubmission_clientId_formId_formVersion_instanceNumber_key" ON "FormSubmission"("clientId", "formId", "formVersion", "instanceNumber");
