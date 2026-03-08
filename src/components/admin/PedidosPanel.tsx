const pedidos = [
  { id: "#001", cliente: "Juan Pérez", producto: "Fotos Final Sub-12", total: "$8.000", estado: "Entregado" },
  { id: "#002", cliente: "María López", producto: "Pack Familia", total: "$18.000", estado: "Entregado" },
  { id: "#003", cliente: "Carlos Gómez", producto: "Highlight Jornada 8", total: "$12.000", estado: "En proceso" },
  { id: "#004", cliente: "Ana Martínez", producto: "Retrato Individual", total: "$5.000", estado: "Pendiente" },
];

const statusColor: Record<string, string> = {
  Entregado: "bg-primary/20 text-primary",
  "En proceso": "bg-accent/20 text-accent",
  Pendiente: "bg-destructive/20 text-destructive",
};

const PedidosPanel = () => (
  <div className="p-6">
    <h2 className="font-space font-bold uppercase text-2xl text-foreground mb-6">Gestión de Pedidos</h2>

    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left p-4">ID</th>
              <th className="text-left p-4">Cliente</th>
              <th className="text-left p-4">Producto</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Estado</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="p-4 text-foreground font-mono">{p.id}</td>
                <td className="p-4 text-foreground">{p.cliente}</td>
                <td className="p-4 text-muted-foreground">{p.producto}</td>
                <td className="p-4 text-primary font-semibold">{p.total}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor[p.estado] || ""}`}>
                    {p.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default PedidosPanel;
