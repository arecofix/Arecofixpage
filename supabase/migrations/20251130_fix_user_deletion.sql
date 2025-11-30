-- Fix "Database error deleting user" by ensuring ON DELETE CASCADE is set on foreign keys

-- 1. profiles
-- Ensure profiles are deleted when the user is deleted
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_id_fkey,
ADD CONSTRAINT profiles_id_fkey
FOREIGN KEY (id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- 2. auth_logs (if exists and linked)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'auth_logs' AND column_name = 'user_id') THEN
        ALTER TABLE public.auth_logs
        DROP CONSTRAINT IF EXISTS auth_logs_user_id_fkey;
        
        ALTER TABLE public.auth_logs
        ADD CONSTRAINT auth_logs_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE;
    END IF;
END $$;

-- 3. repairs (if exists and linked)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'repairs' AND column_name = 'user_id') THEN
        ALTER TABLE public.repairs
        DROP CONSTRAINT IF EXISTS repairs_user_id_fkey;
        
        ALTER TABLE public.repairs
        ADD CONSTRAINT repairs_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE;
    END IF;
END $$;

-- 4. customer_devices (if exists and linked)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customer_devices' AND column_name = 'user_id') THEN
        ALTER TABLE public.customer_devices
        DROP CONSTRAINT IF EXISTS customer_devices_user_id_fkey;
        
        ALTER TABLE public.customer_devices
        ADD CONSTRAINT customer_devices_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE;
    END IF;
END $$;
