import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import DashboardPanel from "@/components/admin/DashboardPanel";
import NoticiasPanel from "@/components/admin/NoticiasPanel";
import GaleriaPanel from "@/components/admin/GaleriaPanel";
import EstadisticasPanel from "@/components/admin/EstadisticasPanel";
import FechasPanel from "@/components/admin/FechasPanel";
import ProductosPanel from "@/components/admin/ProductosPanel";
import PedidosPanel from "@/components/admin/PedidosPanel";
import { Loader2 } from "lucide-react";

const panels: Record<string, React.FC<any>> = {
  noticias: NoticiasPanel,
  galeria: GaleriaPanel,
  estadisticas: EstadisticasPanel,
  fechas: FechasPanel,
  productos: ProductosPanel,
  pedidos: PedidosPanel,
};

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
    if (activePanel === "dashboard") {
      return <DashboardPanel onNavigate={(p) => setActivePanel(p)} />;
    }
    const Panel = panels[activePanel] || DashboardPanel;
    return <Panel />;
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
