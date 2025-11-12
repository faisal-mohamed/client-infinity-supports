-- Clean duplicate StaffFormSubmission records
-- Keep only the latest submission for each staffId + formKey combination

-- First, let's see if there are duplicates
SELECT staffId, formKey, COUNT(*) as count
FROM "StaffFormSubmission"
GROUP BY staffId, formKey
HAVING COUNT(*) > 1;

-- If duplicates exist, delete older ones and keep the newest
-- (Uncomment and run if duplicates found)
/*
DELETE FROM "StaffFormSubmission" a
USING "StaffFormSubmission" b
WHERE a.id < b.id 
  AND a.staffId = b.staffId 
  AND a.formKey = b.formKey;
*/

-- After cleaning, you can safely run: npx prisma db push --accept-data-loss

