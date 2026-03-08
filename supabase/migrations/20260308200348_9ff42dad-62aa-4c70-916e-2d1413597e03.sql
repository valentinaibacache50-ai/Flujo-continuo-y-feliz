-- Hero config table (single row)
CREATE TABLE public.hero_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  badge text NOT NULL DEFAULT 'PORTAL DEPORTIVO · FÚTBOL JUVENIL',
  title1 text NOT NULL DEFAULT 'SEMILLERO',
  title2 text NOT NULL DEFAULT 'DE CAMPEONES',
  description text NOT NULL DEFAULT 'Cobertura deportiva del fútbol juvenil y de barrio.',
  cta_text text NOT NULL DEFAULT 'Explorar contenido',
  cta_href text NOT NULL DEFAULT '#noticias',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.hero_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read hero_config" ON public.hero_config FOR SELECT USING (true);
CREATE POLICY "Admin insert hero_config" ON public.hero_config FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update hero_config" ON public.hero_config FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete hero_config" ON public.hero_config FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Tienda/productos table
CREATE TABLE public.productos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  precio text NOT NULL,
  precio_anual text,
  periodo text NOT NULL DEFAULT 'por evento',
  descripcion text,
  features text[] NOT NULL DEFAULT '{}',
  whatsapp_url text,
  es_popular boolean NOT NULL DEFAULT false,
  orden int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read productos" ON public.productos FOR SELECT USING (true);
CREATE POLICY "Admin insert productos" ON public.productos FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update productos" ON public.productos FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete productos" ON public.productos FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Contacto config table (single row)
CREATE TABLE public.contacto_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp text NOT NULL DEFAULT '+57 300 000 0000',
  facebook text NOT NULL DEFAULT '@semillerodecampeonesav',
  cobertura text NOT NULL DEFAULT 'Fútbol Juvenil y de Barrio · Colombia',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contacto_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read contacto_config" ON public.contacto_config FOR SELECT USING (true);
CREATE POLICY "Admin update contacto_config" ON public.contacto_config FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin insert contacto_config" ON public.contacto_config FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));