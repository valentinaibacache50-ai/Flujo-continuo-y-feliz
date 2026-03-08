ALTER TABLE public.galeria ADD COLUMN IF NOT EXISTS fecha_publicacion timestamptz DEFAULT now();
ALTER TABLE public.reportajes ADD COLUMN IF NOT EXISTS fecha_publicacion timestamptz DEFAULT now();