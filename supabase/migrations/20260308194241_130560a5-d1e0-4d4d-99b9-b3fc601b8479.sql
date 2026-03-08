
-- Drop overly permissive write policies and replace with admin-only

-- Noticias
DROP POLICY "Authenticated insert noticias" ON public.noticias;
DROP POLICY "Authenticated update noticias" ON public.noticias;
DROP POLICY "Authenticated delete noticias" ON public.noticias;
CREATE POLICY "Admin insert noticias" ON public.noticias FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update noticias" ON public.noticias FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete noticias" ON public.noticias FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Galeria
DROP POLICY "Authenticated insert galeria" ON public.galeria;
DROP POLICY "Authenticated update galeria" ON public.galeria;
DROP POLICY "Authenticated delete galeria" ON public.galeria;
CREATE POLICY "Admin insert galeria" ON public.galeria FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update galeria" ON public.galeria FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete galeria" ON public.galeria FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Estadisticas
DROP POLICY "Authenticated insert estadisticas" ON public.estadisticas;
DROP POLICY "Authenticated update estadisticas" ON public.estadisticas;
DROP POLICY "Authenticated delete estadisticas" ON public.estadisticas;
CREATE POLICY "Admin insert estadisticas" ON public.estadisticas FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update estadisticas" ON public.estadisticas FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete estadisticas" ON public.estadisticas FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Fechas
DROP POLICY "Authenticated insert fechas" ON public.fechas;
DROP POLICY "Authenticated update fechas" ON public.fechas;
DROP POLICY "Authenticated delete fechas" ON public.fechas;
CREATE POLICY "Admin insert fechas" ON public.fechas FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update fechas" ON public.fechas FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete fechas" ON public.fechas FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Quienes somos
DROP POLICY "Authenticated insert quienes_somos" ON public.quienes_somos;
DROP POLICY "Authenticated update quienes_somos" ON public.quienes_somos;
DROP POLICY "Authenticated delete quienes_somos" ON public.quienes_somos;
CREATE POLICY "Admin insert quienes_somos" ON public.quienes_somos FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update quienes_somos" ON public.quienes_somos FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete quienes_somos" ON public.quienes_somos FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Storage - tighten to admin only
DROP POLICY "Authenticated upload imagenes" ON storage.objects;
DROP POLICY "Authenticated update imagenes" ON storage.objects;
DROP POLICY "Authenticated delete imagenes" ON storage.objects;
CREATE POLICY "Admin upload imagenes" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'imagenes' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update imagenes" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'imagenes' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete imagenes" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'imagenes' AND public.has_role(auth.uid(), 'admin'));
