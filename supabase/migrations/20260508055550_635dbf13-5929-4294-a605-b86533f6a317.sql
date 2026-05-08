
-- 1. featured_events RLS
ALTER TABLE public.featured_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Featured events publicly readable"
  ON public.featured_events FOR SELECT USING (true);

CREATE POLICY "Admins manage featured events"
  ON public.featured_events FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

-- 2. cadres table policy fix
DROP POLICY IF EXISTS "Admin can manage cadres" ON public.cadres;
CREATE POLICY "Admins manage cadres"
  ON public.cadres FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

-- 3. cadres storage bucket policies (require admin role)
DROP POLICY IF EXISTS "Admin Insert" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;

CREATE POLICY "Admins upload cadres media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'cadres' AND private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update cadres media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'cadres' AND private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (bucket_id = 'cadres' AND private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete cadres media"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'cadres' AND private.has_role(auth.uid(), 'admin'::app_role));

-- 4. avatars bucket: replace overly broad policy with scoped per-user
DROP POLICY IF EXISTS "Avatar Management" ON storage.objects;
DROP POLICY IF EXISTS "Avatar upload policy" ON storage.objects;
DROP POLICY IF EXISTS "Avatar update policy" ON storage.objects;

CREATE POLICY "Avatars publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users upload own avatar"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Users update own avatar"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (auth.uid())::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'avatars' AND (auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete own avatar"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND (auth.uid())::text = (storage.foldername(name))[1]);

-- 5. Restrict allowed mime types per bucket
UPDATE storage.buckets
  SET allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/gif','image/svg+xml','video/mp4','video/webm','video/quicktime']
  WHERE id = 'news-media';

UPDATE storage.buckets
  SET allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/gif']
  WHERE id IN ('avatars','cadres');
