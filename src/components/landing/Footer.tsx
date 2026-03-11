import { Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border py-8 px-4">
    <div className="max-w-7xl mx-auto text-center">
      <p className="font-space font-bold uppercase text-lg tracking-wide text-foreground mb-2">
        Semillero de Campeones
      </p>
      <p className="text-sm text-muted-foreground mb-4">
        Portal Deportivo · Fútbol de Barrio
      </p>
      <div className="flex justify-center gap-4 mb-4">
        <a href="#" className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
          <Facebook size={16} />
        </a>
        <a href="#" className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
          <Instagram size={16} />
        </a>
        <a href="#" className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
          <Youtube size={16} />
        </a>
        <a href="#" className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
          <MessageCircle size={16} />
        </a>
      </div>
      <p className="text-xs text-muted-foreground">
        © 2026 Semillero de Campeones · Portal Deportivo Independiente · Fútbol Juvenil y de Barrio
      </p>
    </div>
  </footer>
);

export default Footer;
