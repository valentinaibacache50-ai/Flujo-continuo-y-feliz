-- ============================================================
-- Crear tablas albumes y galeria si no existen
-- ============================================================

CREATE TABLE IF NOT EXISTS albumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descripcion text,
  jornada text,
  miniatura_url text,
  fecha_publicacion timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS galeria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  tipo text NOT NULL DEFAULT 'Foto',
  imagen_url text,
  video_url text,
  album_id uuid REFERENCES albumes(id) ON DELETE CASCADE,
  fecha_publicacion timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Agregar columna descripcion si no existe (para DBs que ya tienen la tabla)
ALTER TABLE albumes ADD COLUMN IF NOT EXISTS descripcion text;

-- FK desde galeria a albumes (si no existe)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'galeria_album_id_fkey' AND table_name = 'galeria'
  ) THEN
    ALTER TABLE galeria
      ADD CONSTRAINT galeria_album_id_fkey
      FOREIGN KEY (album_id) REFERENCES albumes(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE albumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE galeria ENABLE ROW LEVEL SECURITY;

-- Lectura pública
CREATE POLICY IF NOT EXISTS "Albumes public read"
  ON albumes FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Galeria public read"
  ON galeria FOR SELECT USING (true);

-- Escritura solo admins
CREATE POLICY IF NOT EXISTS "Albumes admin write"
  ON albumes FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY IF NOT EXISTS "Galeria admin write"
  ON galeria FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- ============================================================
-- Storage bucket "imagenes"
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('imagenes', 'imagenes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY IF NOT EXISTS "Public read imagenes"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'imagenes');

CREATE POLICY IF NOT EXISTS "Admin upload imagenes"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'imagenes'
    AND public.has_role(auth.uid(), 'admin'::public.app_role)
  );

CREATE POLICY IF NOT EXISTS "Admin delete imagenes"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'imagenes'
    AND public.has_role(auth.uid(), 'admin'::public.app_role)
  );
