/*
  Warnings:

  - You are about to drop the column `ndisNumber` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `baseVersion` on the `FormActivityLog` table. All the data in the column will be lost.
  - You are about to drop the column `clientVersion` on the `FormActivityLog` table. All the data in the column will be lost.
  - You are about to drop the column `formKey` on the `FormActivityLog` table. All the data in the column will be lost.
  - You are about to drop the column `performedById` on the `FormActivityLog` table. All the data in the column will be lost.
  - You are about to drop the column `clientVersion` on the `FormProgress` table. All the data in the column will be lost.
  - You are about to drop the column `formKey` on the `FormProgress` table. All the data in the column will be lost.
  - You are about to drop the column `clientVersion` on the `FormSignature` table. All the data in the column will be lost.
  - You are about to drop the column `formKey` on the `FormSignature` table. All the data in the column will be lost.
  - You are about to drop the column `baseVersion` on the `FormSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `clientVersion` on the `FormSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `formKey` on the `FormSubmission` table. All the data in the column will be lost.
  - You are about to drop the `ClientForm` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Contract` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FormAccessLink` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[clientId,formId,formVersion]` on the table `FormProgress` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clientId]` on the table `FormSignature` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clientId,formId,formVersion]` on the table `FormSubmission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[formKey]` on the table `MasterForm` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `Admin` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `logType` to the `FormActivityLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `formId` to the `FormProgress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `formVersion` to the `FormProgress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `formId` to the `FormSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `formVersion` to the `FormSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('CLIENT', 'ADMIN');

-- DropForeignKey
ALTER TABLE "ClientForm" DROP CONSTRAINT "ClientForm_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_clientId_fkey";

-- DropForeignKey
ALTER TABLE "FormAccessLink" DROP CONSTRAINT "FormAccessLink_clientId_fkey";

-- DropForeignKey
ALTER TABLE "FormActivityLog" DROP CONSTRAINT "FormActivityLog_performedById_fkey";

-- DropIndex
DROP INDEX "Client_ndisNumber_key";

-- DropIndex
DROP INDEX "FormProgress_clientId_formKey_clientVersion_key";

-- DropIndex
DROP INDEX "FormSignature_clientId_formKey_clientVersion_key";

-- DropIndex
DROP INDEX "FormSubmission_clientId_formKey_clientVersion_key";

-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "ndisNumber",
DROP COLUMN "passwordHash",
ADD COLUMN     "createdById" INTEGER;

-- AlterTable
ALTER TABLE "FormActivityLog" DROP COLUMN "baseVersion",
DROP COLUMN "clientVersion",
DROP COLUMN "formKey",
DROP COLUMN "performedById",
ADD COLUMN     "adminId" INTEGER,
ADD COLUMN     "logType" "LogType" NOT NULL;

-- AlterTable
ALTER TABLE "FormProgress" DROP COLUMN "clientVersion",
DROP COLUMN "formKey",
ADD COLUMN     "formId" INTEGER NOT NULL,
ADD COLUMN     "formVersion" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "FormSignature" DROP COLUMN "clientVersion",
DROP COLUMN "formKey";

-- AlterTable
ALTER TABLE "FormSubmission" DROP COLUMN "baseVersion",
DROP COLUMN "clientVersion",
DROP COLUMN "formKey",
ADD COLUMN     "formId" INTEGER NOT NULL,
ADD COLUMN     "formVersion" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ClientForm";

-- DropTable
DROP TABLE "Contract";

-- DropTable
DROP TABLE "FormAccessLink";

-- CreateTable
CREATE TABLE "CommonField" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "name" TEXT,
    "age" INTEGER,
    "email" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommonField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Insight" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "age" INTEGER,
    "location" TEXT,
    "disability" TEXT,
    "language" TEXT,
    "contractStart" TIMESTAMP(3),
    "contractEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Insight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommonField_clientId_key" ON "CommonField"("clientId");

-- CreateIndex
CREATE INDEX "FormActivityLog_clientId_adminId_idx" ON "FormActivityLog"("clientId", "adminId");

-- CreateIndex
CREATE UNIQUE INDEX "FormProgress_clientId_formId_formVersion_key" ON "FormProgress"("clientId", "formId", "formVersion");

-- CreateIndex
CREATE UNIQUE INDEX "FormSignature_clientId_key" ON "FormSignature"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "FormSubmission_clientId_formId_formVersion_key" ON "FormSubmission"("clientId", "formId", "formVersion");

-- CreateIndex
CREATE UNIQUE INDEX "MasterForm_formKey_key" ON "MasterForm"("formKey");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmission" ADD CONSTRAINT "FormSubmission_formId_fkey" FOREIGN KEY ("formId") REFERENCES "MasterForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormProgress" ADD CONSTRAINT "FormProgress_formId_fkey" FOREIGN KEY ("formId") REFERENCES "MasterForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommonField" ADD CONSTRAINT "CommonField_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insight" ADD CONSTRAINT "Insight_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormActivityLog" ADD CONSTRAINT "FormActivityLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Admin_email_key" RENAME TO "Admin_email_unique";

-- RenameIndex
ALTER INDEX "Client_email_key" RENAME TO "Client_email_unique";
