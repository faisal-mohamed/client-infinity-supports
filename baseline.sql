-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('CLIENT', 'ADMIN');

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterForm" (
    "id" SERIAL NOT NULL,
    "formKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "schema" JSONB,
    "requiresSignature" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasterForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormBatch" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "batchToken" TEXT NOT NULL,
    "passcode" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isSignatureOnly" BOOLEAN NOT NULL DEFAULT false,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "adminNotified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FormBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormAssignment" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "formId" INTEGER NOT NULL,
    "formVersion" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentStatus" TEXT NOT NULL DEFAULT 'not_started',
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "isCommonFieldsCompleted" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "batchId" INTEGER NOT NULL,
    "assignedById" INTEGER,

    CONSTRAINT "FormAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormSubmission" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "formId" INTEGER NOT NULL,
    "formVersion" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "isSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "filledByAdmin" BOOLEAN NOT NULL DEFAULT false,
    "adminFilledAt" TIMESTAMP(3),
    "clientSignature" TEXT,
    "clientSignedAt" TIMESTAMP(3),

    CONSTRAINT "FormSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormProgress" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "formId" INTEGER NOT NULL,
    "formVersion" INTEGER NOT NULL,
    "currentSection" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommonField" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "name" TEXT,
    "age" INTEGER,
    "email" TEXT,
    "sex" TEXT,
    "street" TEXT,
    "state" TEXT,
    "postCode" TEXT,
    "dob" TEXT,
    "ndis" TEXT,
    "disability" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "phone" TEXT,
    "surname" TEXT,

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

-- CreateTable
CREATE TABLE "FormActivityLog" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER,
    "adminId" INTEGER,
    "logType" "LogType" NOT NULL,
    "action" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignatureBatchForm" (
    "id" SERIAL NOT NULL,
    "batchId" INTEGER NOT NULL,
    "formSubmissionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SignatureBatchForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_settings" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "defaultValue" TEXT,
    "validation" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "adminId" INTEGER,

    CONSTRAINT "app_settings_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Staff" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "startDate" TIMESTAMP(3),
    "linkToken" TEXT,
    "linkExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffBullyingHarassmentTraining" (
    "id" SERIAL NOT NULL,
    "staffId" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "staffSignature" TEXT,
    "staffSignedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffBullyingHarassmentTraining_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffBullyingTraining" (
    "id" SERIAL NOT NULL,
    "staffId" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "staffSignature" TEXT,
    "staffSignedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffBullyingTraining_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffConflictOfInterest" (
    "id" SERIAL NOT NULL,
    "staffId" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "staffSignature" TEXT,
    "staffSignedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffConflictOfInterest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffDocumentationAcknowledgement" (
    "id" SERIAL NOT NULL,
    "staffId" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "staffSignature" TEXT,
    "staffSignedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffDocumentationAcknowledgement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffEmploymentDetails" (
    "id" SERIAL NOT NULL,
    "staffId" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "staffSignature" TEXT,
    "staffSignedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffEmploymentDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffEmploymentWelcomeAck" (
    "id" SERIAL NOT NULL,
    "staffId" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "staffSignature" TEXT,
    "staffSignedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffEmploymentWelcomeAck_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "StaffNdisCodeOfConduct" (
    "id" SERIAL NOT NULL,
    "staffId" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "staffSignature" TEXT,
    "staffSignedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffNdisCodeOfConduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffNdisWorkforceCapability" (
    "id" SERIAL NOT NULL,
    "staffId" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "staffSignature" TEXT,
    "staffSignedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffNdisWorkforceCapability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffPreEmploymentMedical" (
    "id" SERIAL NOT NULL,
    "staffId" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "staffSignature" TEXT,
    "staffSignedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffPreEmploymentMedical_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffSupportWorker" (
    "id" SERIAL NOT NULL,
    "staffId" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "staffSignature" TEXT,
    "staffSignedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffSupportWorker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_unique" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MasterForm_formKey_key" ON "MasterForm"("formKey");

-- CreateIndex
CREATE UNIQUE INDEX "MasterForm_formKey_version_key" ON "MasterForm"("formKey", "version");

-- CreateIndex
CREATE UNIQUE INDEX "FormBatch_batchToken_key" ON "FormBatch"("batchToken");

-- CreateIndex
CREATE UNIQUE INDEX "FormAssignment_clientId_formId_formVersion_key" ON "FormAssignment"("clientId", "formId", "formVersion");

-- CreateIndex
CREATE UNIQUE INDEX "FormSubmission_clientId_formId_formVersion_key" ON "FormSubmission"("clientId", "formId", "formVersion");

-- CreateIndex
CREATE UNIQUE INDEX "FormProgress_clientId_formId_formVersion_key" ON "FormProgress"("clientId", "formId", "formVersion");

-- CreateIndex
CREATE UNIQUE INDEX "CommonField_clientId_key" ON "CommonField"("clientId");

-- CreateIndex
CREATE INDEX "FormActivityLog_clientId_adminId_idx" ON "FormActivityLog"("clientId", "adminId");

-- CreateIndex
CREATE UNIQUE INDEX "SignatureBatchForm_batchId_formSubmissionId_key" ON "SignatureBatchForm"("batchId", "formSubmissionId");

-- CreateIndex
CREATE INDEX "app_settings_category_adminId_idx" ON "app_settings"("category", "adminId");

-- CreateIndex
CREATE UNIQUE INDEX "app_settings_key_adminId_key" ON "app_settings"("key", "adminId");

-- CreateIndex
CREATE INDEX "FormSubmissionNotification_adminId_isRead_idx" ON "FormSubmissionNotification"("adminId", "isRead");

-- CreateIndex
CREATE INDEX "FormSubmissionNotification_createdAt_idx" ON "FormSubmissionNotification"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_linkToken_key" ON "Staff"("linkToken");

-- CreateIndex
CREATE UNIQUE INDEX "StaffBullyingHarassmentTraining_staffId_key" ON "StaffBullyingHarassmentTraining"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "StaffBullyingTraining_staffId_key" ON "StaffBullyingTraining"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "StaffConflictOfInterest_staffId_key" ON "StaffConflictOfInterest"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "StaffDocumentationAcknowledgement_staffId_key" ON "StaffDocumentationAcknowledgement"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "StaffEmploymentDetails_staffId_key" ON "StaffEmploymentDetails"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "StaffEmploymentWelcomeAck_staffId_key" ON "StaffEmploymentWelcomeAck"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "StaffFormSubmission_staffId_formKey_key" ON "StaffFormSubmission"("staffId", "formKey");

-- CreateIndex
CREATE UNIQUE INDEX "StaffNdisCodeOfConduct_staffId_key" ON "StaffNdisCodeOfConduct"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "StaffNdisWorkforceCapability_staffId_key" ON "StaffNdisWorkforceCapability"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "StaffPreEmploymentMedical_staffId_key" ON "StaffPreEmploymentMedical"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "StaffSupportWorker_staffId_key" ON "StaffSupportWorker"("staffId");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormBatch" ADD CONSTRAINT "FormBatch_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAssignment" ADD CONSTRAINT "FormAssignment_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAssignment" ADD CONSTRAINT "FormAssignment_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "FormBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAssignment" ADD CONSTRAINT "FormAssignment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAssignment" ADD CONSTRAINT "FormAssignment_formId_fkey" FOREIGN KEY ("formId") REFERENCES "MasterForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmission" ADD CONSTRAINT "FormSubmission_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmission" ADD CONSTRAINT "FormSubmission_formId_fkey" FOREIGN KEY ("formId") REFERENCES "MasterForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormProgress" ADD CONSTRAINT "FormProgress_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormProgress" ADD CONSTRAINT "FormProgress_formId_fkey" FOREIGN KEY ("formId") REFERENCES "MasterForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommonField" ADD CONSTRAINT "CommonField_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insight" ADD CONSTRAINT "Insight_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormActivityLog" ADD CONSTRAINT "FormActivityLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormActivityLog" ADD CONSTRAINT "FormActivityLog_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignatureBatchForm" ADD CONSTRAINT "SignatureBatchForm_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "FormBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignatureBatchForm" ADD CONSTRAINT "SignatureBatchForm_formSubmissionId_fkey" FOREIGN KEY ("formSubmissionId") REFERENCES "FormSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_settings" ADD CONSTRAINT "app_settings_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmissionNotification" ADD CONSTRAINT "FormSubmissionNotification_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmissionNotification" ADD CONSTRAINT "FormSubmissionNotification_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmissionNotification" ADD CONSTRAINT "FormSubmissionNotification_formSubmissionId_fkey" FOREIGN KEY ("formSubmissionId") REFERENCES "FormSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffBullyingHarassmentTraining" ADD CONSTRAINT "StaffBullyingHarassmentTraining_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffBullyingTraining" ADD CONSTRAINT "StaffBullyingTraining_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffConflictOfInterest" ADD CONSTRAINT "StaffConflictOfInterest_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffDocumentationAcknowledgement" ADD CONSTRAINT "StaffDocumentationAcknowledgement_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffEmploymentDetails" ADD CONSTRAINT "StaffEmploymentDetails_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffEmploymentWelcomeAck" ADD CONSTRAINT "StaffEmploymentWelcomeAck_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffFormSubmission" ADD CONSTRAINT "StaffFormSubmission_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffNdisCodeOfConduct" ADD CONSTRAINT "StaffNdisCodeOfConduct_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffNdisWorkforceCapability" ADD CONSTRAINT "StaffNdisWorkforceCapability_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffPreEmploymentMedical" ADD CONSTRAINT "StaffPreEmploymentMedical_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffSupportWorker" ADD CONSTRAINT "StaffSupportWorker_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

