

# Plan: Llenar secciones vacías + Fix warning de consola

## Testing realizado

La navegación, scroll suave, lightboxes de galería y reportajes, y todas las secciones con datos funcionan correctamente. No se detectaron errores de scroll ni de overflow.

## Problema encontrado en consola

`Function components cannot be given refs` — viene del ErrorBoundary. Se necesita revisar cómo se wrappea.

## Secciones vacías a llenar con datos de ejemplo

No se pudo acceder al Facebook (bloquea scraping automático), pero basándome en el contexto existente del sitio (fútbol juvenil y de barrio en Argentina, Liga Al Toque, escuelas formativas), voy a insertar datos realistas.

### 1. Estadísticas — Insertar datos de ejemplo

Tabla `estadisticas`: campos `categoria`, `label`, `value`, `suffix`

Datos a insertar:
- **Sub-12**: Equipos: 8, Jugadores: 120, Goles: 85, Partidos: 24
- **Sub-15**: Equipos: 10, Jugadores: 150, Goles: 110, Partidos: 30
- **Sub-17**: Equipos: 6, Jugadores: 90, Goles: 72, Partidos: 18

### 2. Fechas — Insertar partidos de ejemplo

Tabla `fechas`: campos `fecha`, `dia`, `hora`, `local`, `visitante`, `categoria`, `sede`, `en_vivo`

Datos: 4-5 partidos con equipos que coincidan con el contexto (Club El Renacer, Tercer Tiempo, etc. que ya aparecen en reportajes).

### 3. Noticias — Insertar noticias de ejemplo

Tabla `noticias`: campos `titulo`, `tag`, `descripcion`, `fecha`, `imagen_url`, `categoria`, `tiempo_lectura`

Datos: 3-4 noticias sobre torneos, resultados, inauguraciones, que reflejen el contenido típico de Semillero de Campeones.

## Ejecución

Una sola migración SQL con todos los INSERTs para poblar las 3 tablas vacías.

## Archivos a modificar
- Migration SQL nueva (insertar datos de ejemplo en estadísticas, fechas y noticias)

