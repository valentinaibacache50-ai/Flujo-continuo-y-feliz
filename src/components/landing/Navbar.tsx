import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo-ball.png";

const navLinks = [
  { label: "Galería", href: "#galeria" },
  { label: "Estadísticas", href: "#estadisticas" },
  { label: "Fechas", href: "#fechas" },
  { label: "Noticias", href: "#noticias" },
  { label: "Reportajes", href: "#reportajes" },
  { label: "Tienda", href: "#tienda" },
  { label: "Contacto", href: "#contacto" },
];

const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault();
  if (href === "#") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.querySelector(href);
  if (el) {
    const offset = 72; // navbar height + padding
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
};

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <a href="#" onClick={(e) => scrollToSection(e, "#")} className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shadow-md">
            <img src={logo} alt="Pelota Semillero de Campeones" className="h-8 w-8 object-contain" />
          </div>
        </a>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} onClick={(e) => scrollToSection(e, l.href)} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 top-16 z-40 md:hidden" onClick={() => setOpen(false)} />
          <div className="md:hidden relative z-50 bg-background border-b border-border px-4 pb-4 space-y-1">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={(e) => { scrollToSection(e, l.href); setOpen(false); }} className="block py-2.5 px-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                {l.label}
              </a>
            ))}
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
