import { useState } from "react";
import { Menu, X, Trophy } from "lucide-react";

const navLinks = [
  { label: "Quiénes Somos", href: "#quienes-somos" },
  { label: "Galería", href: "#galeria" },
  { label: "Estadísticas", href: "#estadisticas" },
  { label: "Fechas", href: "#fechas" },
  { label: "Noticias", href: "#noticias" },
  { label: "Tienda", href: "#tienda" },
  { label: "Contacto", href: "#contacto" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Trophy className="h-4 w-4 text-primary" />
          </div>
          <span className="font-space text-2xl font-bold tracking-wide text-foreground">
            Semillero de Campeones
          </span>
        </a>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 space-y-2">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-2 text-muted-foreground hover:text-primary transition-colors">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
