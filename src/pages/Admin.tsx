import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import DashboardPanel from "@/components/admin/DashboardPanel";
import HeroPanel from "@/components/admin/HeroPanel";
import NoticiasPanel from "@/components/admin/NoticiasPanel";
import GaleriaPanel from "@/components/admin/GaleriaPanel";
import EstadisticasPanel from "@/components/admin/EstadisticasPanel";
import FechasPanel from "@/components/admin/FechasPanel";
import TiendaPanel from "@/components/admin/TiendaPanel";
import ContactoPanel from "@/components/admin/ContactoPanel";
import ReportajesPanel from "@/components/admin/ReportajesPanel";
import PedidosPanel from "@/components/admin/PedidosPanel";
import PublicidadPanel from "@/components/admin/PublicidadPanel";
import ProgramaPanel from "@/components/admin/ProgramaPanel";
import { Loader2 } from "lucide-react";

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [activePanel, setActivePanel] = useState("dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) return <AdminLogin />;

  const renderPanel = () => {
    switch (activePanel) {
      case "hero": return <HeroPanel />;
      case "noticias": return <NoticiasPanel />;
      case "galeria": return <GaleriaPanel />;
      case "programa": return <ProgramaPanel />;
      case "estadisticas": return <EstadisticasPanel />;
      case "fechas": return <FechasPanel />;
      case "tienda": return <TiendaPanel />;
      case "reportajes": return <ReportajesPanel />;
      case "publicidad": return <PublicidadPanel />;
      case "contacto": return <ContactoPanel />;
      case "pedidos": return <PedidosPanel />;
      default: return <DashboardPanel onNavigate={(p) => setActivePanel(p)} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar activePanel={activePanel} onSelect={(p) => { setActivePanel(p); setMobileMenu(false); }} />

      {mobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-background/80" onClick={() => setMobileMenu(false)} />
          <div className="relative w-64 min-h-screen bg-card border-r border-border p-4">
            <AdminSidebar activePanel={activePanel} onSelect={(p) => { setActivePanel(p); setMobileMenu(false); }} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <AdminTopbar activePanel={activePanel} onLogout={signOut} onMobileMenu={() => setMobileMenu(!mobileMenu)} />
        <main className="flex-1 overflow-auto">
          {renderPanel()}
        </main>
      </div>
    </div>
  );
};

export default Admin;
