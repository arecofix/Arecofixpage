-- Run this in your Supabase SQL Editor to trigger the edge function on new user signup
-- Make sure to replace YOUR_PROJECT_URL and YOUR_ANON_KEY

-- 1. Enable pg_net extension if not enabled
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Create the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user_welcome_email() 
RETURNS trigger AS $$
DECLARE
  edge_function_url text := 'https://[YOUR_PROJECT_ID].supabase.co/functions/v1/send-welcome-email';
  anon_key text := 'YOUR_ANON_KEY';
BEGIN
  -- We use pg_net to send an async HTTP POST to our edge function
  perform net.http_post(
      url:=> edge_function_url,
      headers:=> jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || anon_key
      ),
      body:=> jsonb_build_object('record', row_to_json(NEW))
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created_send_welcome ON auth.users;
CREATE TRIGGER on_auth_user_created_send_welcome
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_welcome_email();
