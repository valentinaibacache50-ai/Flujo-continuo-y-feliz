-- Prevent empty video_url from being inserted/updated
CREATE OR REPLACE FUNCTION public.validate_programa_video_url()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.video_url IS NULL OR trim(NEW.video_url) = '' THEN
    RAISE EXCEPTION 'video_url no puede estar vacío';
  END IF;
  NEW.video_url := trim(NEW.video_url);
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_programa_video_url
BEFORE INSERT OR UPDATE ON public.programa_episodios
FOR EACH ROW
EXECUTE FUNCTION public.validate_programa_video_url();