# Migration Fix - Step by Step

## Current Issue
Migration `20250910123926_remove_client_email_unique` is marked as FAILED in the database.

## Root Cause
The migration tried to drop an index that doesn't exist, causing it to fail and get marked as failed in Prisma's `_prisma_migrations` table.

## Fix Steps (Run in exact order)

### Step 1: Resolve the failed migration
```bash
npx prisma migrate resolve --applied 20250910123926_remove_client_email_unique
```

### Step 2: Deploy remaining migrations
```bash
npx prisma migrate deploy
```

### Step 3: Regenerate Prisma client
```bash
npx prisma generate
```

## What Each Command Does

1. **migrate resolve --applied**: Marks the failed migration as successfully applied in the database
2. **migrate deploy**: Applies any remaining pending migrations (including the password reset fields)
3. **generate**: Updates the Prisma client to match the new schema

## Alternative: Reset Migration State (Nuclear Option)
If the above doesn't work, you can reset the migration state:

```bash
npx prisma migrate resolve --rolled-back 20250910123926_remove_client_email_unique
npx prisma migrate deploy
```

## Verification
After running the steps, check:
- `npx prisma studio` should work without errors
- Admin table should have `resetToken` and `resetTokenExpiry` columns
