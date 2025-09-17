-- Add missing resetToken and resetTokenExpiry columns to Admin table
-- This fixes the P2022 error: Column Admin.resetToken does not exist

DO $$ 
BEGIN
    -- Check if resetToken column exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Admin' AND column_name = 'resetToken'
    ) THEN
        ALTER TABLE "Admin" ADD COLUMN "resetToken" TEXT;
    END IF;
    
    -- Check if resetTokenExpiry column exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Admin' AND column_name = 'resetTokenExpiry'
    ) THEN
        ALTER TABLE "Admin" ADD COLUMN "resetTokenExpiry" TIMESTAMP(3);
    END IF;
END $$;
