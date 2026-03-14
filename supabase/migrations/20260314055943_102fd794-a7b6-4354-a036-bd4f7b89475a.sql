CREATE POLICY "Public update views programa"
ON public.programa_episodios
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);