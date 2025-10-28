/*
  Warnings:

  - You are about to drop the column `version` on the `ClientForm` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `FormAccessLink` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `FormActivityLog` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `FormProgress` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `FormSignature` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `FormSubmission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clientId,formKey,clientVersion]` on the table `ClientForm` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clientId,formKey,clientVersion]` on the table `FormProgress` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clientId,formKey,clientVersion]` on the table `FormSignature` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clientId,formKey,clientVersion]` on the table `FormSubmission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `baseVersion` to the `ClientForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientVersion` to the `ClientForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientVersion` to the `FormAccessLink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientVersion` to the `FormProgress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientVersion` to the `FormSignature` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseVersion` to the `FormSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientVersion` to the `FormSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClientForm" DROP COLUMN "version",
ADD COLUMN     "baseVersion" INTEGER NOT NULL,
ADD COLUMN     "clientVersion" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "FormAccessLink" DROP COLUMN "version",
ADD COLUMN     "clientVersion" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "FormActivityLog" DROP COLUMN "version",
ADD COLUMN     "baseVersion" INTEGER,
ADD COLUMN     "clientVersion" INTEGER;

-- AlterTable
ALTER TABLE "FormProgress" DROP COLUMN "version",
ADD COLUMN     "clientVersion" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "FormSignature" DROP COLUMN "version",
ADD COLUMN     "clientVersion" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "FormSubmission" DROP COLUMN "version",
ADD COLUMN     "baseVersion" INTEGER NOT NULL,
ADD COLUMN     "clientVersion" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ClientForm_clientId_formKey_clientVersion_key" ON "ClientForm"("clientId", "formKey", "clientVersion");

-- CreateIndex
CREATE UNIQUE INDEX "FormProgress_clientId_formKey_clientVersion_key" ON "FormProgress"("clientId", "formKey", "clientVersion");

-- CreateIndex
CREATE UNIQUE INDEX "FormSignature_clientId_formKey_clientVersion_key" ON "FormSignature"("clientId", "formKey", "clientVersion");

-- CreateIndex
CREATE UNIQUE INDEX "FormSubmission_clientId_formKey_clientVersion_key" ON "FormSubmission"("clientId", "formKey", "clientVersion");
