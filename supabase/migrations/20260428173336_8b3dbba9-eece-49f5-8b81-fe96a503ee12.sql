GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated;

DROP POLICY IF EXISTS "Admins and editors can upload news media" ON storage.objects;
CREATE POLICY "Admins and editors can upload news media"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'news-media'
    AND public.has_role(auth.uid(), 'admin'::public.app_role)
      OR bucket_id = 'news-media'
    AND public.has_role(auth.uid(), 'editor'::public.app_role)
  );

DROP POLICY IF EXISTS "Admins and editors can update news media" ON storage.objects;
CREATE POLICY "Admins and editors can update news media"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'news-media'
    AND (
      public.has_role(auth.uid(), 'admin'::public.app_role)
      OR public.has_role(auth.uid(), 'editor'::public.app_role)
    )
  )
  WITH CHECK (
    bucket_id = 'news-media'
    AND (
      public.has_role(auth.uid(), 'admin'::public.app_role)
      OR public.has_role(auth.uid(), 'editor'::public.app_role)
    )
  );

DROP POLICY IF EXISTS "Admins can delete news media" ON storage.objects;
CREATE POLICY "Admins can delete news media"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'news-media'
    AND public.has_role(auth.uid(), 'admin'::public.app_role)
  );