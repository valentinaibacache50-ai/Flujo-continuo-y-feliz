ALTER TABLE public.albumes ADD COLUMN IF NOT EXISTS tipo text NOT NULL DEFAULT 'fotos';

CREATE TABLE IF NOT EXISTS public.programa_episodios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descripcion text,
  video_url text NOT NULL,
  miniatura_url text,
  temporada integer NOT NULL DEFAULT 1,
  episodio integer NOT NULL DEFAULT 1,
  duracion text DEFAULT '00:00',
  fecha_publicacion timestamptz DEFAULT now(),
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.programa_episodios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read programa_episodios" ON public.programa_episodios FOR SELECT TO public USING (true);
CREATE POLICY "Admin insert programa_episodios" ON public.programa_episodios FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin update programa_episodios" ON public.programa_episodios FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin delete programa_episodios" ON public.programa_episodios FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));