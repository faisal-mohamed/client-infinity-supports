-- Remove unique constraint from Client email
ALTER TABLE "Client" DROP CONSTRAINT IF EXISTS "Client_email_key";
DROP INDEX IF EXISTS "Client_email_key";
DROP INDEX IF EXISTS "Client_email_unique";
