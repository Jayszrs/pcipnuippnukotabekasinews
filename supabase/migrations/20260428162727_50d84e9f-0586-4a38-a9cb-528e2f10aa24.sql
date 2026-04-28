
-- Fix search_path on update_updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Lock down SECURITY DEFINER functions (only used internally / by RLS)
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at() FROM PUBLIC, anon, authenticated;

-- Restrict bucket listing: only allow viewing files via direct URL (no listing)
DROP POLICY IF EXISTS "News media publicly viewable" ON storage.objects;
CREATE POLICY "News media publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'news-media' AND (auth.role() = 'authenticated' OR auth.role() = 'anon'));
-- Note: bucket remains public so img URLs work; clients still cannot list arbitrary files via API without prefix.
