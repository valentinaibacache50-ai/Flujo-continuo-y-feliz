

## Plan: Convert "Semillero de Campeones" to React

Two static HTML pages will be converted into a full React application with routing:

### Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Public landing page (hero, noticias, galeria, estadisticas, cronicas, tienda, contacto) |
| `/admin` | Admin panel (login, dashboard, CRUD panels for all content sections) |

### Theme & Styling

Update `index.css` CSS variables to match the dark green sports theme:
- Background: `#0f1a10`, Surface: `#1c2a1e`, Green: `#2d7a3a` / `#52c464`
- Import Google Fonts: Outfit + Bebas Neue
- All custom component styles via Tailwind utility classes

### File Structure

```text
src/
├── pages/
│   ├── Index.tsx          (public landing page - all sections)
│   └── Admin.tsx          (admin panel with login + sidebar + panels)
├── components/
│   ├── landing/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Noticias.tsx
│   │   ├── Galeria.tsx
│   │   ├── Estadisticas.tsx
│   │   ├── Cronicas.tsx
│   │   ├── Tienda.tsx
│   │   ├── Contacto.tsx
│   │   ├── Footer.tsx
│   │   └── ShopModal.tsx
│   └── admin/
│       ├── AdminLogin.tsx
│       ├── AdminSidebar.tsx
│       ├── AdminTopbar.tsx
│       ├── DashboardPanel.tsx
│       ├── NoticiasPanel.tsx
│       ├── GaleriaPanel.tsx
│       ├── EstadisticasPanel.tsx
│       ├── CronicasPanel.tsx
│       ├── ProductosPanel.tsx
│       └── PedidosPanel.tsx
```

### Key Behaviors

- **Public page**: Smooth scroll navigation, gallery/shop filter buttons, product modal with format selector, contact form with alert, responsive hamburger menu
- **Admin page**: Login screen (hardcoded credentials as in original), sidebar navigation switching panels via React state, form show/hide toggles, file upload preview, toast notifications on save
- **All data is static/mock** (same as the HTML originals) - no backend needed initially

### Implementation Tasks (8 files to create/edit)

1. Update `index.css` with the green dark theme variables and font imports
2. Create all landing page components (Navbar through Footer + ShopModal)
3. Compose them in `Index.tsx`
4. Create all admin components (Login, Sidebar, panels)
5. Compose them in `Admin.tsx` with state management for active panel and login
6. Add `/admin` route in `App.tsx`

