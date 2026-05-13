-- Add soft delete fields to Client
ALTER TABLE "Client" ADD COLUMN "archivedAt" TIMESTAMP(3);
ALTER TABLE "Client" ADD COLUMN "archivedBy" INTEGER;

-- Add soft delete fields to FormAssignment
ALTER TABLE "FormAssignment" ADD COLUMN "archivedAt" TIMESTAMP(3);
ALTER TABLE "FormAssignment" ADD COLUMN "archivedBy" INTEGER;

-- Create indexes for efficient filtering
CREATE INDEX "Client_archivedAt_idx" ON "Client"("archivedAt");
CREATE INDEX "FormAssignment_archivedAt_idx" ON "FormAssignment"("archivedAt");
