-- Create publicidad table for advertising banners
CREATE TABLE public.publicidad (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo text NOT NULL,
    imagen_url text,
    enlace_url text,
    activo boolean NOT NULL DEFAULT true,
    orden integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.publicidad ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Public read publicidad" ON public.publicidad
    FOR SELECT USING (true);

-- Admin insert policy
CREATE POLICY "Admin insert publicidad" ON public.publicidad
    FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admin update policy
CREATE POLICY "Admin update publicidad" ON public.publicidad
    FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin delete policy
CREATE POLICY "Admin delete publicidad" ON public.publicidad
    FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));