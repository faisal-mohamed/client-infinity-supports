-- CreateTable
CREATE TABLE "mfa_codes" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "mfaToken" TEXT,
    "tokenExpiresAt" TIMESTAMP(3),
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mfa_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mfa_codes_adminId_used_expiresAt_idx" ON "mfa_codes"("adminId", "used", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "mfa_codes_mfaToken_key" ON "mfa_codes"("mfaToken");

-- CreateIndex
CREATE INDEX "mfa_codes_mfaToken_idx" ON "mfa_codes"("mfaToken");

-- AddForeignKey
ALTER TABLE "mfa_codes" ADD CONSTRAINT "mfa_codes_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
