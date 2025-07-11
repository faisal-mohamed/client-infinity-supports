-- This is a manual migration to reset the FormSubmission sequence
-- You can run this as a custom migration

-- Step 1: Create a new migration file
-- npx prisma migrate dev --create-only --name reset_form_submission_sequence

-- Step 2: Add this SQL to the generated migration file:

-- Reset the sequence to continue from the highest existing ID
SELECT setval(
  pg_get_serial_sequence('"FormSubmission"', 'id'), 
  COALESCE((SELECT MAX(id) FROM "FormSubmission"), 0) + 1, 
  false
);

-- Step 3: Apply the migration
-- npx prisma migrate dev
