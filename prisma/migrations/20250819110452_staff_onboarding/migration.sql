-- CreateTable
CREATE TABLE "StaffFormSubmission" (
    "id" SERIAL NOT NULL,
    "staffId" INTEGER NOT NULL,
    "formKey" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "isSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffFormSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StaffFormSubmission_staffId_formKey_key" ON "StaffFormSubmission"("staffId", "formKey");

-- AddForeignKey
ALTER TABLE "StaffFormSubmission" ADD CONSTRAINT "StaffFormSubmission_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
