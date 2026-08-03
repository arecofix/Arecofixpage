-- Fix Function Search Path Mutable warnings and restrict Public access to SECURITY DEFINER functions

-- 1. save_repair_order
ALTER FUNCTION public.save_repair_order(jsonb) SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.save_repair_order(jsonb) FROM public;
GRANT EXECUTE ON FUNCTION public.save_repair_order(jsonb) TO authenticated;

-- 2. accept_upsell_vidrio
ALTER FUNCTION public.accept_upsell_vidrio(text) SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.accept_upsell_vidrio(text) FROM public;
-- Might be used by clients viewing their repair, so we allow anon and authenticated
GRANT EXECUTE ON FUNCTION public.accept_upsell_vidrio(text) TO anon, authenticated;

-- 3. add_upsell_item_to_repair
ALTER FUNCTION public.add_upsell_item_to_repair(text, uuid) SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.add_upsell_item_to_repair(text, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.add_upsell_item_to_repair(text, uuid) TO anon, authenticated;

-- 4. get_my_tenant
ALTER FUNCTION public.get_my_tenant() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.get_my_tenant() FROM public;
GRANT EXECUTE ON FUNCTION public.get_my_tenant() TO anon, authenticated;

-- 5. get_repair_tracking
ALTER FUNCTION public.get_repair_tracking(text) SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.get_repair_tracking(text) FROM public;
GRANT EXECUTE ON FUNCTION public.get_repair_tracking(text) TO anon, authenticated;


-- Fix RLS Disabled in Public for profiles table

-- 1. Enable RLS on public.profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Basic Policies for profiles
-- Allow anyone to read profiles (needed for instructors, public users, etc)
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

-- Allow users to insert their own profile during signup
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
