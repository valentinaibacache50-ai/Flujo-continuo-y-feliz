const Footer = () => (
  <footer className="border-t border-border py-8 px-4">
    <div className="max-w-7xl mx-auto text-center">
      <p className="font-space font-bold uppercase text-lg tracking-wide text-foreground mb-2">
        Semillero de Campeones
      </p>
      <p className="text-sm text-muted-foreground mb-4">
        Portal Deportivo · Fútbol Juvenil
      </p>
      <div className="flex justify-center gap-4 text-xl mb-4">
        <span className="cursor-pointer hover:scale-110 transition-transform">📘</span>
        <span className="cursor-pointer hover:scale-110 transition-transform">📸</span>
        <span className="cursor-pointer hover:scale-110 transition-transform">▶</span>
        <span className="cursor-pointer hover:scale-110 transition-transform">💬</span>
      </div>
      <p className="text-xs text-muted-foreground">
        © 2025 Semillero de Campeones · Portal Deportivo Independiente · Fútbol Juvenil y de Barrio
      </p>
    </div>
  </footer>
);

export default Footer;
