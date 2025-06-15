
-- Set the correct role for the superadmin user in profiles
UPDATE public.profiles
SET role = 'superadmin'
WHERE email = 'superadmin@fuelsync.com';
