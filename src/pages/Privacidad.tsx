import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Privacidad = () => (
  <div className="min-h-screen bg-background">
    <div className="max-w-3xl mx-auto px-5 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-primary text-sm mb-8 hover:underline">
        <ArrowLeft size={14} /> Volver al inicio
      </Link>

      <h1 className="font-space font-bold text-3xl text-foreground mb-6">Política de Privacidad</h1>
      <p className="text-muted-foreground text-xs mb-8">Última actualización: Marzo 2026</p>

      <div className="prose prose-sm prose-invert max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-foreground text-lg font-semibold">1. Información que Recopilamos</h2>
          <p>Semillero de Campeones recopila información limitada para el funcionamiento del portal deportivo. Esto puede incluir datos de navegación, cookies técnicas y, en caso de contacto, la información que el usuario proporcione voluntariamente.</p>
        </section>

        <section>
          <h2 className="text-foreground text-lg font-semibold">2. Uso de la Información</h2>
          <p>La información recopilada se utiliza exclusivamente para: mejorar la experiencia del usuario en el sitio, gestionar el contenido deportivo y responder consultas de contacto.</p>
        </section>

        <section>
          <h2 className="text-foreground text-lg font-semibold">3. Cookies</h2>
          <p>Este sitio utiliza cookies técnicas necesarias para su funcionamiento. No utilizamos cookies de terceros con fines publicitarios. Puede desactivar las cookies desde la configuración de su navegador.</p>
        </section>

        <section>
          <h2 className="text-foreground text-lg font-semibold">4. Compartir Datos</h2>
          <p>No vendemos, comercializamos ni transferimos información personal a terceros. La información solo se comparte cuando es necesario para cumplir con obligaciones legales.</p>
        </section>

        <section>
          <h2 className="text-foreground text-lg font-semibold">5. Seguridad</h2>
          <p>Implementamos medidas de seguridad técnicas y organizativas para proteger la información contra acceso no autorizado, alteración o destrucción.</p>
        </section>

        <section>
          <h2 className="text-foreground text-lg font-semibold">6. Derechos del Usuario</h2>
          <p>Tiene derecho a acceder, rectificar y eliminar sus datos personales. Para ejercer estos derechos, contáctenos a través de la sección de Contacto.</p>
        </section>

        <section>
          <h2 className="text-foreground text-lg font-semibold">7. Cambios en la Política</h2>
          <p>Nos reservamos el derecho de actualizar esta política. Los cambios serán publicados en esta página con la fecha de última actualización.</p>
        </section>
      </div>
    </div>
  </div>
);

export default Privacidad;
