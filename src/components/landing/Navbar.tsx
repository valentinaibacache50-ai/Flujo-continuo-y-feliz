import { useState, useEffect } from "react";
import { Menu, X, CalendarDays } from "lucide-react";
import logo from "@/assets/logo-ball.png";

const navLinks = [
  { label: "Galería", href: "#galeria" },
  { label: "Estadísticas", href: "#estadisticas" },
  { label: "Goles Destacados", href: "#goles-destacados" },
  { label: "Figuras Destacadas", href: "#figuras-destacadas" },
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

const formatToday = () =>
  new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const useLiveDate = () => {
  const [date, setDate] = useState<string>(formatToday);
  useEffect(() => {
    let timeoutId: number;
    const scheduleNext = () => {
      const now = new Date();
      const next = new Date(now);
      next.setHours(24, 0, 1, 0); // 1s after next midnight
      timeoutId = window.setTimeout(() => {
        setDate(formatToday());
        scheduleNext();
      }, next.getTime() - now.getTime());
    };
    scheduleNext();
    const onVisible = () => { if (document.visibilityState === "visible") setDate(formatToday()); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { window.clearTimeout(timeoutId); document.removeEventListener("visibilitychange", onVisible); };
  }, []);
  return date;
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const today = useLiveDate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <a href="#" onClick={(e) => scrollToSection(e, "#")} className="flex items-center gap-2 shrink-0">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shadow-md">
            <img src={logo} alt="Pelota Semillero de Campeones" className="h-8 w-8 object-contain" loading="eager" />
          </div>
          <span className="font-bebas text-foreground tracking-wide leading-tight text-sm sm:text-base lg:text-lg">
            SEMILLERO<br className="sm:hidden" />{" "}DE CAMPEONES
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-foreground capitalize whitespace-nowrap mr-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30">
          <CalendarDays size={14} className="text-primary" />
          <time dateTime={new Date().toISOString().slice(0, 10)}>{today}</time>
        </div>

        <div className="hidden md:flex items-center gap-3 lg:gap-5">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} onClick={(e) => scrollToSection(e, l.href)} className="text-xs lg:text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground capitalize px-2.5 py-1.5 rounded-full bg-primary/15 border border-primary/30">
            <CalendarDays size={12} className="text-primary" />
            <time dateTime={new Date().toISOString().slice(0, 10)}>
              {new Date().toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" })}
            </time>
          </div>
          <button className="text-foreground" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 top-16 z-40 md:hidden" onClick={() => setOpen(false)} />
          <div className="md:hidden relative z-50 bg-background border-b border-border px-4 pb-4 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground capitalize pt-2 pb-1 border-b border-border/50 mb-1">
              <CalendarDays size={12} className="text-primary" />
              <time dateTime={new Date().toISOString().slice(0, 10)}>{today}</time>
            </div>
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
