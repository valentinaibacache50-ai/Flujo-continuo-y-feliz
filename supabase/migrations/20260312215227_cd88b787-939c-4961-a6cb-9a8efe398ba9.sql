
ALTER TABLE public.galeria ADD COLUMN album_id uuid REFERENCES public.albumes(id) ON DELETE SET NULL;
