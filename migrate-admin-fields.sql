-- Migration: Add missing Admin resetToken fields
-- Run this SQL directly in your PostgreSQL database

BEGIN;

-- Add resetToken column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Admin' AND column_name = 'resetToken'
    ) THEN
        ALTER TABLE "Admin" ADD COLUMN "resetToken" TEXT;
        RAISE NOTICE 'Added resetToken column';
    ELSE
        RAISE NOTICE 'resetToken column already exists';
    END IF;
END $$;

-- Add resetTokenExpiry column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Admin' AND column_name = 'resetTokenExpiry'
    ) THEN
        ALTER TABLE "Admin" ADD COLUMN "resetTokenExpiry" TIMESTAMP(3);
        RAISE NOTICE 'Added resetTokenExpiry column';
    ELSE
        RAISE NOTICE 'resetTokenExpiry column already exists';
    END IF;
END $$;

COMMIT;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Admin' 
AND column_name IN ('resetToken', 'resetTokenExpiry');
