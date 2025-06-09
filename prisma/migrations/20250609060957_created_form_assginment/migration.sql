-- AlterTable
ALTER TABLE "CommonField" ADD COLUMN     "disability" TEXT,
ADD COLUMN     "dob" TEXT,
ADD COLUMN     "ndis" TEXT,
ADD COLUMN     "postCode" TEXT,
ADD COLUMN     "sex" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "street" TEXT;

-- CreateTable
CREATE TABLE "FormAssignment" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "formId" INTEGER NOT NULL,
    "formVersion" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "accessToken" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FormAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FormAssignment_accessToken_key" ON "FormAssignment"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "FormAssignment_clientId_formId_formVersion_key" ON "FormAssignment"("clientId", "formId", "formVersion");

-- AddForeignKey
ALTER TABLE "FormAssignment" ADD CONSTRAINT "FormAssignment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAssignment" ADD CONSTRAINT "FormAssignment_formId_fkey" FOREIGN KEY ("formId") REFERENCES "MasterForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
