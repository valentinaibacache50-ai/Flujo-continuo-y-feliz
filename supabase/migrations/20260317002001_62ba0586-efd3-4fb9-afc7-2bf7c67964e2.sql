-- Add a column for tracking play starts (most accurate "view" metric)
ALTER TABLE public.programa_episodios
ADD COLUMN IF NOT EXISTS vistas_inicio integer NOT NULL DEFAULT 0;

-- Update the RPC to handle the new view type
CREATE OR REPLACE FUNCTION public.increment_programa_view(ep_id uuid, view_type text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF view_type = 'start' THEN
    UPDATE programa_episodios SET vistas_inicio = vistas_inicio + 1 WHERE id = ep_id;
  ELSIF view_type = 'half' THEN
    UPDATE programa_episodios SET vistas_mitad = vistas_mitad + 1 WHERE id = ep_id;
  ELSIF view_type = 'complete' THEN
    UPDATE programa_episodios SET vistas_completas = vistas_completas + 1 WHERE id = ep_id;
  END IF;
END;
$$;