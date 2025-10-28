/*
  Warnings:

  - A unique constraint covering the columns `[key,adminId]` on the table `app_settings` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "app_settings_key_key";

-- CreateIndex
CREATE UNIQUE INDEX "app_settings_key_adminId_key" ON "app_settings"("key", "adminId");
