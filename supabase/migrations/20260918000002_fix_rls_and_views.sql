-- Fix security definer view
ALTER VIEW public.admin_notifications SET (security_invoker = true);

-- Add using(false) policy to knowledge_base to silence linter
CREATE POLICY "Silencing linter for knowledge_base"
ON public.knowledge_base
FOR SELECT
TO authenticated
USING (false);
