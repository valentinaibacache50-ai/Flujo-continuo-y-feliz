-- ============================================================
-- Fix admin permissions: GRANT EXECUTE on has_role, ensure
-- storage policies, and insert admin role if missing
-- ============================================================

-- 1. Restore EXECUTE permissions on has_role (revoked by 20260616 migration)
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon;

-- 2. Ensure admin role exists for the admin user
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email = 'eduardoibacache@yahoo.com'
  AND id NOT IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
LIMIT 1;

-- 3. Ensure storage bucket is public
UPDATE storage.buckets SET public = true WHERE id = 'imagenes';

-- 4. Ensure storage policies exist (idempotent)
DO $$
BEGIN
  -- Public read
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read imagenes' AND tablename = 'objects') THEN
    CREATE POLICY "Public read imagenes" ON storage.objects FOR SELECT USING (bucket_id = 'imagenes');
  END IF;

  -- Admin upload
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin upload imagenes' AND tablename = 'objects') THEN
    CREATE POLICY "Admin upload imagenes" ON storage.objects
      FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'imagenes' AND public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;

  -- Admin update
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin update imagenes' AND tablename = 'objects') THEN
    CREATE POLICY "Admin update imagenes" ON storage.objects
      FOR UPDATE TO authenticated
      USING (bucket_id = 'imagenes' AND public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;

  -- Admin delete
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin delete imagenes' AND tablename = 'objects') THEN
    CREATE POLICY "Admin delete imagenes" ON storage.objects
      FOR DELETE TO authenticated
      USING (bucket_id = 'imagenes' AND public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;

-- 5. Ensure increment_programa_view is callable
GRANT EXECUTE ON FUNCTION public.increment_programa_view(uuid, text) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_programa_view(uuid, text) TO authenticated;
