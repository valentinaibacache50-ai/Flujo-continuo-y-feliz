

## Plan: Multiple Improvements and New "Programa" Section

This is a large multi-part request. Here's the plan broken down:

---

### 1. Fix Build Error (TS2589 in GaleriaPanel)

**Root cause**: The `albumes` table has no `tipo` column, but code at line 157 does `.eq("tipo", tipo)`. TypeScript can't resolve the type.

**Fix**: Add a `tipo` column to `albumes` table via migration (`text`, default `'fotos'`), then update existing albums that contain only videos. This aligns the DB with how the code already filters albums.

---

### 2. Change Hero Background Image

Copy the uploaded image (`WhatsApp_Image_2026-03-13_at_5.37.14_PM.jpeg`) to `public/hero-bg.jpg`, replacing the current one. The existing Hero component already references `/hero-bg.jpg` with Ken Burns animation — no code changes needed beyond the file swap.

---

### 3. Legal Pages (Privacy Policy, Terms, Copyright)

- Create `/privacidad` and `/terminos` routes with proper Spanish legal content (Política de Privacidad, Términos y Condiciones).
- Add links in `Footer.tsx` to these pages.
- Update the copyright notice in the footer to include "Todos los derechos reservados".
- Add a cookie consent banner component.

---

### 4. Fix Publicidad Visibility (All Formats / Desktop)

**Current state**: Only 1 ad exists in DB with `posicion: "popup"` and `activo: true`. No ads with `posicion: "carrusel"` exist — that's why the carousel section shows nothing (it filters by `carrusel`).

**Root cause of desktop popup not showing**: The `PopupAd` component seems correct, but the `AnimatePresence` wrapping around the portal may not trigger exit animations properly.

**Fix**:
- Ensure the popup renders reliably by moving `AnimatePresence` inside the portal.
- Also add a "carrusel" ad entry from the admin or adjust the Publicidad component to also show `popup` ads in the main section if no carousel ads exist.
- Double-check: the single existing ad has an image URL — verify image loads correctly.

---

### 5. Fix Admin Gallery - Photos Not Visible

**Root cause**: The admin `AlbumsView` queries `.eq("tipo", tipo)` but the `albumes` table has no `tipo` column. After adding the column (step 1), existing albums will default to `"fotos"` and will appear properly.

Additionally, the `AlbumFotosView` only shows items where `album_id` matches, but some gallery items have `album_id: null` (uploaded before albums existed). These won't appear in any album view — this is expected behavior but worth noting.

---

### 6. New "Programa" Section

Create a new section called "Programa" (about Semillero de Campeones) positioned between Publicidad and Galería in the landing page. This simulates a TV-style sports show:

**Database**: New `programa_episodios` table:
- `id`, `titulo`, `descripcion`, `video_url` (YouTube or direct), `miniatura_url`, `temporada`, `episodio` (number), `duracion` (text like "45:00"), `fecha_publicacion`, `activo`, `created_at`

**Landing component** (`Programa.tsx`):
- TV show style layout with a featured/latest episode as main player
- Episode list below in a grid (like Netflix/YouTube channel)
- Each episode clickable to play in an embedded player
- Professional "show" styling with episode numbers, duration badges

**Admin panel** (`ProgramaPanel.tsx`):
- CRUD for episodes (title, description, video URL, thumbnail, season, episode number, duration)
- Upload thumbnails or auto-extract from YouTube
- Toggle active/inactive

**Regarding live streaming**: Theoretically yes, you could implement a live streaming feature similar to Kick/Twitch using WebRTC or RTMP. Options include:
- **OBS + RTMP server** (e.g., Mux, Cloudflare Stream, or self-hosted Nginx-RTMP) piping to an HLS player on your site
- **Cloudflare Stream Live** or **Mux** as managed services (~$0.06/min for encoding)
- **YouTube Live** embed as the simplest approach — stream via OBS to YouTube, embed the live player

This would require a separate backend service and is not implementable within the current Lovable project alone, but I can prepare the UI to support a "live" badge and embed when ready.

---

### 7. Page Order in Index.tsx

```text
Navbar
Hero
Publicidad          ← ads (carousel + popup)
Programa            ← NEW section
Galeria (Fotos + Videos)
Estadisticas
Fechas
Noticias
Reportajes
Tienda
Contacto
Footer
```

---

### Summary of Changes

| Area | Action |
|------|--------|
| DB Migration | Add `tipo` column to `albumes`, create `programa_episodios` table |
| `public/hero-bg.jpg` | Replace with uploaded image |
| `Footer.tsx` | Add legal links, update copyright |
| New pages | `/privacidad`, `/terminos` |
| New component | Cookie consent banner |
| `Publicidad.tsx` / `PopupAd.tsx` | Fix desktop rendering |
| `GaleriaPanel.tsx` | Fix TS error (resolved by DB migration) |
| New component | `Programa.tsx` (landing) |
| New component | `ProgramaPanel.tsx` (admin) |
| `AdminSidebar.tsx` / `Admin.tsx` | Add "Programa" panel |
| `Index.tsx` | Add Programa section |

