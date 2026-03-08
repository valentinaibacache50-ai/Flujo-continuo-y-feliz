

# Plan: Robustez general — Eliminar errores y prevenir fallos

## Problemas detectados

1. **Console error**: `Function components cannot be given refs` en `ReportajesPanel` — el sistema de panels en `Admin.tsx` usa `React.FC<any>` en un Record y React intenta pasar refs. No es crítico pero genera warnings.

2. **Lightboxes sin manejo de errores en imágenes/videos** — Si una imagen falla al cargar o un video no existe, no hay fallback visual. Queda roto.

3. **Queries sin `retry` controlado ni error states** — Si Supabase falla, los componentes quedan en loading infinito o crashean sin feedback.

4. **`URL.createObjectURL` memory leaks** en admin panels — Se crean URLs de preview pero nunca se revocan.

5. **Scroll a secciones desde navbar** — No hay smooth scroll ni offset para la navbar fija (64px), las secciones quedan tapadas.

6. **Body overflow lock en lightboxes** — Si el componente se desmonta inesperadamente (error, navegación), `document.body.style.overflow` queda en `hidden` y la página no scrollea más.

## Cambios a realizar

### 1. Galeria.tsx — Error boundaries para media
- Agregar `onError` handler en `<img>` y `<video>` tags para mostrar un placeholder si falla la carga.
- Wrap del lightbox media con try/catch visual.
- Limpiar `body.style.overflow` de forma segura.

### 2. Noticias.tsx — Mismo tratamiento de error en imágenes
- `onError` en `<img>` tags para fallback.

### 3. Reportajes.tsx — Error handling en media
- `onError` handlers en `<img>` y `<video>`.
- Lightbox robusto con fallbacks.

### 4. ReportajesPanel.tsx + GaleriaPanel.tsx — Memory leak fix
- Revocar `URL.createObjectURL` con `useEffect` cleanup.
- `onError` en previews de admin.

### 5. Navbar.tsx — Smooth scroll con offset
- Usar `scrollIntoView` con behavior smooth, o calcular offset manual para la navbar fija de 64px.
- Prevenir el default del anchor click.

### 6. Global Error Boundary — React error boundary
- Crear un componente `ErrorBoundary` que capture crashes de React y muestre un mensaje amigable con botón de "Recargar" en vez de pantalla blanca.
- Envolver la app en `App.tsx`.

### 7. Todas las queries — Error state visible
- Agregar manejo de `isError` en los componentes que usan `useQuery` para mostrar un mensaje tipo "Error al cargar, intentá de nuevo" con botón de retry, en vez de quedarse en loading.

### 8. Admin.tsx — Fix ref warning
- El `panels` Record pasa componentes que reciben refs implícitas. Cambiar el renderizado para evitar que React intente pasar refs.

## Archivos a crear
- `src/components/ErrorBoundary.tsx`

## Archivos a modificar
- `src/App.tsx` — Envolver con ErrorBoundary
- `src/components/landing/Navbar.tsx` — Smooth scroll con offset
- `src/components/landing/Galeria.tsx` — onError handlers, body overflow safety
- `src/components/landing/Noticias.tsx` — onError handlers
- `src/components/landing/Reportajes.tsx` — onError handlers, body overflow safety
- `src/components/admin/GaleriaPanel.tsx` — revokeObjectURL, onError
- `src/components/admin/ReportajesPanel.tsx` — revokeObjectURL, onError
- `src/pages/Admin.tsx` — Fix ref warning en renderPanel

