import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const initialStats = [
  { id: 1, cat: "Sub-12", partidos: 24, goles: 87, goleador: 12, efectividad: 78 },
  { id: 2, cat: "Sub-15", partidos: 20, goles: 65, goleador: 9, efectividad: 65 },
  { id: 3, cat: "Sub-17", partidos: 18, goles: 52, goleador: 8, efectividad: 71 },
];

const EstadisticasPanel = () => {
  const [stats, setStats] = useState(initialStats);
  const { toast } = useToast();

  const update = (id: number, field: string, value: number) => {
    setStats(stats.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const save = () => toast({ title: "Estadísticas guardadas" });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-space font-bold uppercase font-bold uppercase text-2xl text-foreground">Gestión de Estadísticas</h2>
        <button onClick={save} className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90">
          Guardar cambios
        </button>
      </div>

      <div className="space-y-6">
        {stats.map((s) => (
          <div key={s.id} className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-space font-bold uppercase text-xl text-foreground mb-4">{s.cat}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Partidos", field: "partidos", val: s.partidos },
                { label: "Goles", field: "goles", val: s.goles },
                { label: "Máx. goleador", field: "goleador", val: s.goleador },
                { label: "Efectividad %", field: "efectividad", val: s.efectividad },
              ].map((f) => (
                <div key={f.field}>
                  <label className="text-xs text-muted-foreground">{f.label}</label>
                  <input
                    type="number"
                    value={f.val}
                    onChange={(e) => update(s.id, f.field, Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EstadisticasPanel;
