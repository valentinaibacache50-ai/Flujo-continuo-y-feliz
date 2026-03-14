DROP POLICY "Public update views programa" ON public.programa_episodios;

CREATE OR REPLACE FUNCTION public.increment_programa_view(ep_id uuid, view_type text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF view_type = 'half' THEN
    UPDATE programa_episodios SET vistas_mitad = vistas_mitad + 1 WHERE id = ep_id;
  ELSIF view_type = 'complete' THEN
    UPDATE programa_episodios SET vistas_completas = vistas_completas + 1 WHERE id = ep_id;
  END IF;
END;
$$;