/*
  Warnings:

  - You are about to drop the column `accessToken` on the `FormAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `passcode` on the `FormAssignment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "FormAssignment_accessToken_key";

-- AlterTable
ALTER TABLE "FormAssignment" DROP COLUMN "accessToken",
DROP COLUMN "passcode";

-- AlterTable
ALTER TABLE "FormBatch" ADD COLUMN     "passcode" TEXT;
