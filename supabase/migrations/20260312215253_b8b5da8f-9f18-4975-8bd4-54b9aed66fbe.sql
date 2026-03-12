
DROP POLICY "Authenticated manage albumes" ON public.albumes;
CREATE POLICY "Admin manage albumes" ON public.albumes FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update albumes" ON public.albumes FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete albumes" ON public.albumes FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
