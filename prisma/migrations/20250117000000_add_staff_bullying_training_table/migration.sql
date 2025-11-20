-- CreateTable
CREATE TABLE IF NOT EXISTS "StaffBullyingTraining" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "certificateUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffBullyingTraining_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "StaffBullyingTraining_staffId_idx" ON "StaffBullyingTraining"("staffId");

-- AddForeignKey
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'StaffBullyingTraining_staffId_fkey'
    ) THEN
        ALTER TABLE "StaffBullyingTraining" ADD CONSTRAINT "StaffBullyingTraining_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
