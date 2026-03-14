
Objetivo: corregir el crash al abrir videos, asegurar miniaturas visibles en Galería/Admin/Programa, y dejar el flujo robusto para datos viejos y nuevos.

1) Diagnóstico técnico (causa real)
- Error que rompe la página: en `Galeria.tsx` se llama `getYoutubeId(url)` con `url = null` al abrir un video cargado como archivo directo (en DB está en `imagen_url`, mientras `video_url` queda null).
- En el modal de videos de Galería se renderiza siempre `<iframe>` (YouTube), incluso para archivos `.mp4/.webm/.mov`; eso dispara la ruta que usa `match` sobre null.
- Miniaturas que “no se ven”: la portada de álbum de videos en landing se calcula con query `video_url not null`; los videos directos no entran ahí, por eso no hay `firstVideoUrl`.
- Debilidad adicional: `VideoThumbnail.tsx` tiene `attempted.current` global por instancia; si cambia `src`, no vuelve a intentar generar miniatura.

2) Plan de implementación (archivos y cambios)
A. Robustecer utilidades de video (null-safe + fuente unificada)
- Archivos:  
  - `src/components/landing/Galeria.tsx`  
  - `src/components/admin/GaleriaPanel.tsx`  
  - `src/components/landing/Programa.tsx`  
  - `src/components/admin/ProgramaPanel.tsx`
- Cambios:
  - Hacer `getYoutubeId(url?: string | null)` defensivo (`if (!url) return null`).
  - Crear helper local de fuente real: `resolveVideoSource(item) = item.video_url || item.imagen_url || null`.
  - Crear helper `isDirectVideoFile(url)` por extensión (`mp4|webm|mov|ogg`) en vez de asumir “si no es YouTube”.

B. Arreglar crash al abrir videos en Galería
- Archivo: `src/components/landing/Galeria.tsx`
- Cambios:
  - En modal player (`activeVideo`), decidir renderer por tipo:
    - YouTube => `<iframe>`
    - Archivo directo => `<video controls playsInline ...>`
    - Sin fuente => placeholder seguro (sin romper).
  - Reemplazar uso directo de `activeVideo.video_url` por `resolveVideoSource(activeVideo)`.
  - En grilla del modal, usar miniatura desde fuente resuelta (YouTube thumbnail o `VideoThumbnail` para archivo directo).

C. Miniaturas en principal (landing) para todos los videos
- Archivo: `src/components/landing/Galeria.tsx`
- Cambios:
  - Ajustar query de “primer video por álbum” para incluir videos directos (no solo `video_url`):
    - traer `album_id, tipo, video_url, imagen_url` y filtrar tipo video.
  - Construir `firstVideoUrl` con `video_url ?? imagen_url`.
  - Portada de álbum de videos: usar `VideoThumbnail` para archivos directos y thumbnail de YouTube para links.

D. Miniaturas en panel admin (Galería y Programa)
- Archivos:
  - `src/components/admin/GaleriaPanel.tsx`
  - `src/components/admin/ProgramaPanel.tsx`
- Cambios:
  - Galería admin:
    - En alta de video directo, guardar URL subida también en `video_url` (además de `imagen_url`) para consistencia futura.
    - En cards/listados usar siempre `resolveVideoSource`.
  - Programa admin:
    - Donde hoy usa `<video preload="metadata">` para preview, reemplazar por `VideoThumbnail`.
    - Mantener opción de miniatura manual (ya existente), sin cambiar UX.

E. Corregir `VideoThumbnail` para que no “se congele”
- Archivo: `src/components/VideoThumbnail.tsx`
- Cambios:
  - Eliminar patrón `attempted.current` que bloquea nuevos `src`.
  - Resetear estado al cambiar `src`.
  - Manejo robusto de eventos (`loadedmetadata/canplay/seeked/error`) y fallback limpio.
  - Si `src` vacío/null => placeholder seguro, sin excepción.

F. Hardening adicional detectado en logs (no bloqueante, pero recomendable)
- Archivos:
  - `src/components/landing/Tienda.tsx`
  - `src/components/ui/pricing.tsx`
  - opcional `vite.config.ts` (solo si persiste warning)
- Cambios:
  - Convertir `Tienda` y `Pricing` a `forwardRef` para evitar warnings de refs en dev tooling/animaciones.
  - Si continuara el warning, agregar `resolve.dedupe: ["react","react-dom","react/jsx-runtime"]` en Vite.

3) Compatibilidad con datos existentes
- Sin romper contenido actual:
  - Se leerá `video_url` y `imagen_url` (legacy + nuevo).
- Opcional (recomendado): normalización de datos existente para videos directos
  - SQL de mantenimiento: copiar `imagen_url -> video_url` cuando `tipo='Video'` y `video_url is null` (solo filas de archivo directo).
  - No cambia schema, solo limpia datos para evitar futuros casos borde.

4) Validación end-to-end (obligatoria)
- Landing:
  - Abrir álbum de videos con archivos directos: no debe romper, debe abrir reproductor.
  - Verificar miniatura en card de álbum y en miniaturas internas.
- Admin Galería:
  - Subir video directo nuevo y verificar miniatura inmediata.
  - Confirmar que se guarda reproducible y que aparece en landing.
- Programa:
  - Ver miniatura en admin y landing.
  - Confirmar que no se reproduce solo al cargar página (solo al click del usuario).
- Consola:
  - Sin `TypeError: Cannot read properties of null (reading 'match')`.
  - Reducir/eliminar warnings de refs.

5) Resultado esperado
- Se elimina el crash de página al abrir videos.
- Se muestran miniaturas de videos directos y YouTube en principal y panel admin.
- Queda un flujo robusto ante nulos y datos mixtos (legacy/nuevo), evitando que vuelva a romperse por el mismo motivo.
