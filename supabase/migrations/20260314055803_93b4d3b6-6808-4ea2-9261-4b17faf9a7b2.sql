ALTER TABLE public.programa_episodios
  ADD COLUMN IF NOT EXISTS vistas_completas integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vistas_mitad integer NOT NULL DEFAULT 0;