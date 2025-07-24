-- AlterTable
ALTER TABLE "FormAssignment" ADD COLUMN     "assignedById" INTEGER;

-- AddForeignKey
ALTER TABLE "FormAssignment" ADD CONSTRAINT "FormAssignment_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
