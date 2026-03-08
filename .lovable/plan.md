
# Plan: Fix video playback en galería

## Problema detectado
El video fue subido como archivo .mp4 directamente (no como URL de YouTube). La `imagen_url` apunta a un archivo `.mp4`:
```
imagen_url: .../galeria/1773001478979-7te3bo.mp4
video_url: null
```

El lightbox actual solo soporta YouTube embeds. Cuando no encuentra un YouTube ID, intenta mostrarlo como `<img>`, lo cual muestra negro para archivos .mp4.

## Solución

### Galeria.tsx
1. **Detectar archivos de video** por extensión (`.mp4`, `.webm`, `.mov`) en `imagen_url`
2. **En el Lightbox**: si es video directo, renderizar un `<video>` tag con `controls` y `autoplay` en vez de `<img>` o YouTube iframe
3. **En la grilla de thumbnails**: para videos directos sin thumbnail, usar un `<video>` tag con atributo `preload="metadata"` para mostrar el primer frame, o mostrar el ícono de Play sobre fondo oscuro
4. Mantener soporte YouTube para `video_url` existente

### GaleriaPanel.tsx (admin)
5. Permitir subir archivos de video (.mp4) además de imágenes en el input file
6. Mostrar preview del video en el formulario cuando se sube un .mp4

### Archivos a modificar
- `src/components/landing/Galeria.tsx` — agregar soporte `<video>` en lightbox y grid
- `src/components/admin/GaleriaPanel.tsx` — aceptar archivos de video en upload
