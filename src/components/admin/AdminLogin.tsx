import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === "admin" && pass === "1234") {
      onLogin();
    } else {
      toast({ title: "Error", description: "Credenciales incorrectas", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="bg-card border border-border rounded-xl p-8 max-w-sm w-full">
        <div className="text-center mb-6">
          <span className="text-3xl">⚽</span>
          <h1 className="font-space font-bold uppercase text-3xl tracking-wide text-foreground mt-2">
            Semillero de Campeones
          </h1>
          <p className="text-sm text-muted-foreground">Panel Admin</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="USUARIO"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
          <input
            type="password"
            placeholder="CONTRASEÑA"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
