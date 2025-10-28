-- Reset FormSubmission ID sequence to start from 1
-- Run this in your PostgreSQL database

-- First, find the current maximum ID
SELECT MAX(id) FROM "FormSubmission";

-- Reset the sequence to start from the next number after max ID
-- Replace 'your_max_id + 1' with the actual number
SELECT setval(pg_get_serial_sequence('"FormSubmission"', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM "FormSubmission";

-- Or if you want to start fresh from 1 (only if table is empty):
-- SELECT setval(pg_get_serial_sequence('"FormSubmission"', 'id'), 1, false);

-- Verify the sequence
SELECT currval(pg_get_serial_sequence('"FormSubmission"', 'id'));
