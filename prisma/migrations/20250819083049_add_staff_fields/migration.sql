/*
  Warnings:

  - You are about to drop the column `name` on the `Staff` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[linkToken]` on the table `Staff` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstName` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Made the column `status` on table `Staff` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "linkExpiresAt" TIMESTAMP(3),
ADD COLUMN     "linkToken" TEXT,
ADD COLUMN     "surname" TEXT NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'pending';

-- CreateIndex
CREATE UNIQUE INDEX "Staff_linkToken_key" ON "Staff"("linkToken");
