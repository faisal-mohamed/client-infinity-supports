-- CreateTable
CREATE TABLE "FormSubmissionNotification" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "formSubmissionId" INTEGER NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormSubmissionNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FormSubmissionNotification_adminId_isRead_idx" ON "FormSubmissionNotification"("adminId", "isRead");

-- CreateIndex
CREATE INDEX "FormSubmissionNotification_createdAt_idx" ON "FormSubmissionNotification"("createdAt");

-- AddForeignKey
ALTER TABLE "FormSubmissionNotification" ADD CONSTRAINT "FormSubmissionNotification_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmissionNotification" ADD CONSTRAINT "FormSubmissionNotification_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmissionNotification" ADD CONSTRAINT "FormSubmissionNotification_formSubmissionId_fkey" FOREIGN KEY ("formSubmissionId") REFERENCES "FormSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
