
-- Enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Noticias table
CREATE TABLE public.noticias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  tag TEXT NOT NULL,
  descripcion TEXT,
  fecha TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  imagen_url TEXT,
  tiempo_lectura TEXT,
  categoria TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.noticias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read noticias" ON public.noticias FOR SELECT USING (true);
CREATE POLICY "Authenticated insert noticias" ON public.noticias FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update noticias" ON public.noticias FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated delete noticias" ON public.noticias FOR DELETE TO authenticated USING (true);
CREATE TRIGGER update_noticias_updated_at BEFORE UPDATE ON public.noticias FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Galeria table
CREATE TABLE public.galeria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'Foto',
  imagen_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.galeria ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read galeria" ON public.galeria FOR SELECT USING (true);
CREATE POLICY "Authenticated insert galeria" ON public.galeria FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update galeria" ON public.galeria FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated delete galeria" ON public.galeria FOR DELETE TO authenticated USING (true);

-- Estadisticas table
CREATE TABLE public.estadisticas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria TEXT NOT NULL,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  suffix TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.estadisticas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read estadisticas" ON public.estadisticas FOR SELECT USING (true);
CREATE POLICY "Authenticated insert estadisticas" ON public.estadisticas FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update estadisticas" ON public.estadisticas FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated delete estadisticas" ON public.estadisticas FOR DELETE TO authenticated USING (true);

-- Fechas table
CREATE TABLE public.fechas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha TEXT NOT NULL,
  dia TEXT NOT NULL,
  hora TEXT NOT NULL,
  local TEXT NOT NULL,
  visitante TEXT NOT NULL,
  categoria TEXT,
  sede TEXT,
  en_vivo BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.fechas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read fechas" ON public.fechas FOR SELECT USING (true);
CREATE POLICY "Authenticated insert fechas" ON public.fechas FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update fechas" ON public.fechas FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated delete fechas" ON public.fechas FOR DELETE TO authenticated USING (true);

-- Quienes somos table
CREATE TABLE public.quienes_somos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  icono TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.quienes_somos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read quienes_somos" ON public.quienes_somos FOR SELECT USING (true);
CREATE POLICY "Authenticated insert quienes_somos" ON public.quienes_somos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update quienes_somos" ON public.quienes_somos FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated delete quienes_somos" ON public.quienes_somos FOR DELETE TO authenticated USING (true);

-- Storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('imagenes', 'imagenes', true);

-- Storage policies
CREATE POLICY "Public read imagenes" ON storage.objects FOR SELECT USING (bucket_id = 'imagenes');
CREATE POLICY "Authenticated upload imagenes" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'imagenes');
CREATE POLICY "Authenticated update imagenes" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'imagenes');
CREATE POLICY "Authenticated delete imagenes" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'imagenes');
