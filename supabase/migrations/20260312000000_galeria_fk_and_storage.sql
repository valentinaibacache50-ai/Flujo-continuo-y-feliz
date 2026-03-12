-- ============================================================
-- FK: galeria.album_id → albumes.id  (con cascade delete)
-- Esto es necesario para que el admin pueda borrar álbumes
-- y para que las queries de count funcionen correctamente.
-- ============================================================

-- Agregar FK si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'galeria_album_id_fkey'
      AND table_name = 'galeria'
  ) THEN
    ALTER TABLE galeria
      ADD CONSTRAINT galeria_album_id_fkey
      FOREIGN KEY (album_id) REFERENCES albumes(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ============================================================
-- Storage bucket "imagenes" — asegurar que exista y sea público
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('imagenes', 'imagenes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Política: lectura pública
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'Public read imagenes' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Public read imagenes"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'imagenes');
  END IF;
END $$;

-- Política: upload solo admins
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'Admin upload imagenes' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Admin upload imagenes"
      ON storage.objects FOR INSERT
      WITH CHECK (
        bucket_id = 'imagenes'
        AND public.has_role(auth.uid(), 'admin'::public.app_role)
      );
  END IF;
END $$;

-- Política: update solo admins
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'Admin update imagenes' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Admin update imagenes"
      ON storage.objects FOR UPDATE
      USING (
        bucket_id = 'imagenes'
        AND public.has_role(auth.uid(), 'admin'::public.app_role)
      );
  END IF;
END $$;

-- Política: delete solo admins
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'Admin delete imagenes' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Admin delete imagenes"
      ON storage.objects FOR DELETE
      USING (
        bucket_id = 'imagenes'
        AND public.has_role(auth.uid(), 'admin'::public.app_role)
      );
  END IF;
END $$;
