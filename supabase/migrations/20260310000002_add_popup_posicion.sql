ALTER TABLE publicidad DROP CONSTRAINT IF EXISTS publicidad_posicion_check;

ALTER TABLE publicidad
  ADD CONSTRAINT publicidad_posicion_check
  CHECK (posicion IN (
    'carrusel',
    'banner_fijo',
    'entre_noticias',
    'ficha-jugador',
    'articulo-inicio',
    'articulo-final',
    'estadisticas-entre-tablas',
    'video-bajo-reproductor',
    'popup'
  ));
