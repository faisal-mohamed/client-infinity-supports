# Prisma Studio Fix

## Issue
Prisma Studio fails with: `The column Admin.resetToken does not exist in the current database.`

## Quick Fix

### Option 1: Run SQL Migration
Execute `migrate-admin-fields.sql` in your PostgreSQL database:

```bash
# If you have psql access:
psql -d your_database_name -f migrate-admin-fields.sql

# Or copy the SQL content and run it in your database client
```

### Option 2: Use Node.js (if available)
```bash
npm run fix-db
```

### Option 3: Manual Database Update
Connect to your PostgreSQL database and run:

```sql
ALTER TABLE "Admin" ADD COLUMN "resetToken" TEXT;
ALTER TABLE "Admin" ADD COLUMN "resetTokenExpiry" TIMESTAMP(3);
```

## After Running the Fix

1. **Regenerate Prisma Client:**
   ```bash
   npx prisma generate
   ```

2. **Restart Prisma Studio:**
   ```bash
   npx prisma studio
   ```

## Verification
The Admin table should now show the `resetToken` and `resetTokenExpiry` columns in Prisma Studio.
