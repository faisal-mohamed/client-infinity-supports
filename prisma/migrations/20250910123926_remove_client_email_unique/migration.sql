-- DropIndex (conditional)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'Client_email_unique'
    ) THEN
        DROP INDEX "Client_email_unique";
    END IF;
END $$;
