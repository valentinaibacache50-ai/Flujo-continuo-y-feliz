import { BarChart3, FileText, Image, ShoppingBag, Package, LayoutDashboard, Calendar, Sparkles, Users, Phone, Store, Mic } from "lucide-react";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "hero", label: "Hero", icon: Sparkles },
  { id: "quienes-somos", label: "Quiénes Somos", icon: Users },
  { id: "galeria", label: "Galería", icon: Image },
  { id: "estadisticas", label: "Estadísticas", icon: BarChart3 },
  { id: "fechas", label: "Fechas", icon: Calendar },
  { id: "noticias", label: "Noticias", icon: FileText },
  { id: "tienda", label: "Tienda", icon: Store },
  { id: "reportajes", label: "Reportajes", icon: Mic },
  { id: "contacto", label: "Contacto", icon: Phone },
  { id: "pedidos", label: "Pedidos", icon: Package },
];

interface AdminSidebarProps {
  activePanel: string;
  onSelect: (panel: string) => void;
}

const AdminSidebar = ({ activePanel, onSelect }: AdminSidebarProps) => (
  <aside className="w-64 min-h-screen bg-card border-r border-border p-4 hidden md:block">
    <div className="flex items-center gap-2 mb-8 px-2">
      <span className="text-2xl">⚽</span>
      <span className="font-space font-bold text-xl tracking-wide text-foreground">Admin</span>
    </div>
    <nav className="space-y-1">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
            activePanel === item.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          <item.icon size={18} />
          {item.label}
        </button>
      ))}
    </nav>
  </aside>
);

export default AdminSidebar;
