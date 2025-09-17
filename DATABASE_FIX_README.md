# Database Schema Fix

## Issue
The application was throwing this error:
```
The column `Admin.resetToken` does not exist in the current database.
```

## Root Cause
The Prisma schema includes `resetToken` and `resetTokenExpiry` fields in the Admin model, but these columns were not properly applied to the database during migration.

## Immediate Fix Applied
✅ **Fixed the API route** to only select existing fields, preventing the error.

## Complete Solution

### Step 1: Run the database fix script
```bash
npm run fix-db
```

### Step 2: Restart your development server
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

### Alternative: Manual SQL execution
Execute the SQL in `fix-admin-reset-fields.sql`:
```sql
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Admin' AND column_name = 'resetToken'
    ) THEN
        ALTER TABLE "Admin" ADD COLUMN "resetToken" TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Admin' AND column_name = 'resetTokenExpiry'
    ) THEN
        ALTER TABLE "Admin" ADD COLUMN "resetTokenExpiry" TIMESTAMP(3);
    END IF;
END $$;
```

Then regenerate Prisma client:
```bash
npx prisma generate
```

## Verification
The `/api/admin/notifications/count` endpoint should now work without errors.

## Files Modified
- ✅ `src/app/api/admin/notifications/count/route.ts` - Fixed to select only existing fields
- `scripts/fix-database-schema.js` - Database fix script with Prisma regeneration
- `fix-admin-reset-fields.sql` - Manual SQL fix
- `package.json` - Added `fix-db` script
