

# Plan: Sección "Reportajes" — Admin + Landing

Nueva sección dedicada a reportajes/notas sobre dueños de clubs, niños, etc. Separada de Galería y Noticias.

## 1. Nueva tabla `reportajes` en la base de datos

```sql
CREATE TABLE public.reportajes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  titulo text NOT NULL,
  subtitulo text,
  contenido text NOT NULL,
  imagen_url text,
  video_url text,
  tag text NOT NULL DEFAULT 'Reportaje',
  publicado boolean NOT NULL DEFAULT true
);

ALTER TABLE public.reportajes ENABLE ROW LEVEL SECURITY;
-- Mismas políticas que las otras tablas: lectura pública, CRUD admin
```

Campos: título, subtítulo opcional, contenido (texto largo), imagen, video (archivo directo o YouTube URL), tag (ej: "Club", "Juvenil", "Entrevista"), y flag de publicado.

## 2. Panel Admin — `ReportajesPanel.tsx`

Nuevo componente con:
- Formulario para crear reportaje: título, subtítulo, contenido (textarea grande), tag, upload de imagen, campo de video (archivo o URL YouTube).
- Listado de reportajes existentes con opción de eliminar.
- Soporte para subir archivos de video (.mp4) e imágenes al bucket `imagenes`.
- Similar en estructura a `NoticiasPanel` pero con más campos.

## 3. Landing — `Reportajes.tsx`

Nueva sección con:
- Cards con imagen/video de portada, título, subtítulo, tag y extracto del contenido.
- Lightbox para ver imagen/video en grande al hacer click (reutilizando el patrón portal de Galería).
- Soporte para videos directos (.mp4) y YouTube embeds.
- Grid responsive: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.
- Spacing responsive `py-16 md:py-28`.

## 4. Integración

- **AdminSidebar.tsx**: Agregar item "Reportajes" con ícono `Mic` o `FileVideo`.
- **Admin.tsx**: Importar y registrar `ReportajesPanel` en el mapa de panels.
- **Index.tsx**: Agregar `<Reportajes />` entre Noticias y Tienda.
- **Navbar.tsx**: Agregar link "Reportajes" en la navegación.

## Archivos a crear
- `src/components/admin/ReportajesPanel.tsx`
- `src/components/landing/Reportajes.tsx`
- Migration SQL para tabla `reportajes`

## Archivos a modificar
- `src/components/admin/AdminSidebar.tsx` — nuevo item de menú
- `src/pages/Admin.tsx` — registrar panel
- `src/pages/Index.tsx` — agregar sección
- `src/components/landing/Navbar.tsx` — agregar link

