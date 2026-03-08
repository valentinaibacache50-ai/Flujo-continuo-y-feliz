

# Plan: Galería con carrusel horizontal y flechas de navegación

## Cambio principal

Reemplazar el grid vertical (`grid-cols-3`) por un **carrusel horizontal** usando Embla Carousel (ya instalado como `embla-carousel-react`). Los items se mostrarán en una fila horizontal y el usuario navegará con flechas estilizadas a los costados.

## Diseño del carrusel

- Usar los componentes `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext` de `src/components/ui/carousel.tsx`
- Mostrar **3 items en desktop**, **2 en tablet**, **1 en mobile** usando `basis-1/3`, `basis-1/2`, `basis-full` con breakpoints
- Las flechas serán circulares con fondo semi-transparente verde (primary), con hover effect, posicionadas a los lados del carrusel
- Mantener el lightbox y los filtros exactamente como están

## Estilo de las flechas

Customizar `CarouselPrevious` y `CarouselNext` con:
- Fondo `bg-primary/80 hover:bg-primary`
- Texto blanco, tamaño más grande (`h-10 w-10`)
- Posicionadas dentro del contenedor (no fuera con `-left-12`)
- Transición suave

## Archivo a modificar

- `src/components/landing/Galeria.tsx` — reemplazar el `<div className="grid ...">` por el componente `<Carousel>` con sus items y flechas custom

