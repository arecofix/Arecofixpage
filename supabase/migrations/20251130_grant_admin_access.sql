-- Grant admin access to ezequielenrico15@gmail.com
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'ezequielenrico15@gmail.com';
