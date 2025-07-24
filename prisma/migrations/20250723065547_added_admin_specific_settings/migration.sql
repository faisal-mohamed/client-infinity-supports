-- AlterTable
ALTER TABLE "app_settings" ADD COLUMN     "adminId" INTEGER;

-- CreateIndex
CREATE INDEX "app_settings_category_adminId_idx" ON "app_settings"("category", "adminId");

-- AddForeignKey
ALTER TABLE "app_settings" ADD CONSTRAINT "app_settings_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
