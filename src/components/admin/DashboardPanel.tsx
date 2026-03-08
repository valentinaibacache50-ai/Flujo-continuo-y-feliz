const stats = [
  { label: "NOTICIAS", value: "12", change: "+3 este mes", emoji: "📰" },
  { label: "FOTOS/VIDEOS", value: "87", change: "+14 esta semana", emoji: "🖼" },
  { label: "VENTAS", value: "24", change: "+5 este mes", emoji: "🛒" },
  { label: "INGRESOS", value: "$312K", change: "+18% vs mes anterior", emoji: "💰" },
];

const activity = [
  { text: "Nueva crónica publicada: Final Sub-12", time: "Hace 2 horas" },
  { text: "Nueva venta — Pack Familia ($18.000)", time: "Hace 4 horas" },
  { text: "32 fotos subidas: Entrenamiento Sub-15", time: "Ayer" },
  { text: "Estadísticas Jornada 8 actualizadas", time: "Ayer" },
  { text: "Pedido pendiente de confirmar (#004)", time: "Hace 2 días" },
];

const quickActions = [
  { label: "📰 Publicar nueva noticia" },
  { label: "🖼 Subir fotos o videos" },
  { label: "📈 Actualizar estadísticas" },
  { label: "✍️ Escribir crónica" },
  { label: "🛍 Agregar producto a tienda" },
];

const DashboardPanel = () => (
  <div className="p-6 space-y-6">
    {/* Stats grid */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-semibold tracking-wider">{s.label}</span>
            <span className="text-xl">{s.emoji}</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{s.value}</p>
          <p className="text-xs text-primary mt-1">{s.change}</p>
        </div>
      ))}
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      {/* Activity */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-space font-bold uppercase text-xl text-foreground mb-4">ACTIVIDAD RECIENTE</h3>
        <div className="space-y-3">
          {activity.map((a, i) => (
            <div key={i} className="flex items-start justify-between gap-3 text-sm">
              <span className="text-foreground">{a.text}</span>
              <span className="text-muted-foreground whitespace-nowrap text-xs">{a.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-bebas text-xl text-foreground mb-4">ACCIONES RÁPIDAS</h3>
        <div className="space-y-2">
          {quickActions.map((a, i) => (
            <button
              key={i}
              className="w-full text-left px-4 py-3 bg-secondary rounded-lg text-foreground text-sm hover:bg-primary/20 transition-colors"
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default DashboardPanel;
