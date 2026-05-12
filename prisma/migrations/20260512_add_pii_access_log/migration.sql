-- CreateTable
CREATE TABLE "pii_access_log" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "formId" INTEGER,
    "assignmentId" INTEGER,
    "action" TEXT NOT NULL,
    "accessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "pii_access_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pii_access_log_adminId_clientId_idx" ON "pii_access_log"("adminId", "clientId");

-- CreateIndex
CREATE INDEX "pii_access_log_accessedAt_idx" ON "pii_access_log"("accessedAt");
