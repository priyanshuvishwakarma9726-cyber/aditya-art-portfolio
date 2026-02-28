-- Run this directly in your TiDB/MySQL shell or workbench
-- Ensure the user has logged in via Supabase at least once first
UPDATE users SET role = 'admin' WHERE email = 'your.email@example.com';
