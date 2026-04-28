CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO anon, authenticated;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  FOR ALL
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Published news viewable by everyone" ON public.news;
CREATE POLICY "Published news viewable by everyone"
  ON public.news
  FOR SELECT
  USING (
    status = 'published'::public.news_status
    OR private.has_role(auth.uid(), 'admin'::public.app_role)
    OR private.has_role(auth.uid(), 'editor'::public.app_role)
  );

DROP POLICY IF EXISTS "Admins and editors can insert news" ON public.news;
CREATE POLICY "Admins and editors can insert news"
  ON public.news
  FOR INSERT
  TO authenticated
  WITH CHECK (
    private.has_role(auth.uid(), 'admin'::public.app_role)
    OR private.has_role(auth.uid(), 'editor'::public.app_role)
  );

DROP POLICY IF EXISTS "Admins and editors can update news" ON public.news;
CREATE POLICY "Admins and editors can update news"
  ON public.news
  FOR UPDATE
  TO authenticated
  USING (
    private.has_role(auth.uid(), 'admin'::public.app_role)
    OR private.has_role(auth.uid(), 'editor'::public.app_role)
  )
  WITH CHECK (
    private.has_role(auth.uid(), 'admin'::public.app_role)
    OR private.has_role(auth.uid(), 'editor'::public.app_role)
  );

DROP POLICY IF EXISTS "Only admins can delete news" ON public.news;
CREATE POLICY "Only admins can delete news"
  ON public.news
  FOR DELETE
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins and editors can upload news media" ON storage.objects;
CREATE POLICY "Admins and editors can upload news media"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'news-media'
    AND (
      private.has_role(auth.uid(), 'admin'::public.app_role)
      OR private.has_role(auth.uid(), 'editor'::public.app_role)
    )
  );

DROP POLICY IF EXISTS "Admins and editors can update news media" ON storage.objects;
CREATE POLICY "Admins and editors can update news media"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'news-media'
    AND (
      private.has_role(auth.uid(), 'admin'::public.app_role)
      OR private.has_role(auth.uid(), 'editor'::public.app_role)
    )
  )
  WITH CHECK (
    bucket_id = 'news-media'
    AND (
      private.has_role(auth.uid(), 'admin'::public.app_role)
      OR private.has_role(auth.uid(), 'editor'::public.app_role)
    )
  );

DROP POLICY IF EXISTS "Admins can delete news media" ON storage.objects;
CREATE POLICY "Admins can delete news media"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'news-media'
    AND private.has_role(auth.uid(), 'admin'::public.app_role)
  );