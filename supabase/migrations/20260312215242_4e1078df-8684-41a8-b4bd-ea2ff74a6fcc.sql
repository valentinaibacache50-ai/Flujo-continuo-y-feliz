
ALTER TABLE public.albumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read albumes" ON public.albumes FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated manage albumes" ON public.albumes FOR ALL TO authenticated USING (true) WITH CHECK (true);
