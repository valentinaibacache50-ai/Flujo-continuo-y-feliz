
CREATE TABLE public.reportajes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  titulo text NOT NULL,
  subtitulo text,
  contenido text NOT NULL,
  imagen_url text,
  video_url text,
  tag text NOT NULL DEFAULT 'Reportaje',
  publicado boolean NOT NULL DEFAULT true
);

ALTER TABLE public.reportajes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read reportajes" ON public.reportajes FOR SELECT USING (true);
CREATE POLICY "Admin insert reportajes" ON public.reportajes FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin update reportajes" ON public.reportajes FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin delete reportajes" ON public.reportajes FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
