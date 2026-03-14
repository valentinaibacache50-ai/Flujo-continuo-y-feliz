import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Terminos = () => (
  <div className="min-h-screen bg-background">
    <div className="max-w-3xl mx-auto px-5 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-primary text-sm mb-8 hover:underline">
        <ArrowLeft size={14} /> Volver al inicio
      </Link>

      <h1 className="font-space font-bold text-3xl text-foreground mb-6">Términos y Condiciones</h1>
      <p className="text-muted-foreground text-xs mb-8">Última actualización: Marzo 2026</p>

      <div className="prose prose-sm prose-invert max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-foreground text-lg font-semibold">1. Aceptación de los Términos</h2>
          <p>Al acceder y utilizar Semillero de Campeones, usted acepta estos términos y condiciones en su totalidad. Si no está de acuerdo, debe abstenerse de utilizar el sitio.</p>
        </section>

        <section>
          <h2 className="text-foreground text-lg font-semibold">2. Propiedad Intelectual</h2>
          <p>Todo el contenido publicado en este portal (textos, imágenes, videos, logotipos, diseños) es propiedad de Semillero de Campeones o de sus respectivos autores y está protegido por las leyes de propiedad intelectual. Queda prohibida su reproducción sin autorización expresa.</p>
        </section>

        <section>
          <h2 className="text-foreground text-lg font-semibold">3. Uso del Contenido</h2>
          <p>El contenido del portal es para uso informativo y de entretenimiento. Queda prohibido el uso comercial sin autorización previa por escrito.</p>
        </section>

        <section>
          <h2 className="text-foreground text-lg font-semibold">4. Contenido de Terceros</h2>
          <p>Los anuncios publicitarios y enlaces a sitios externos son responsabilidad de sus respectivos anunciantes. Semillero de Campeones no se hace responsable del contenido de terceros.</p>
        </section>

        <section>
          <h2 className="text-foreground text-lg font-semibold">5. Limitación de Responsabilidad</h2>
          <p>Semillero de Campeones no garantiza la disponibilidad ininterrumpida del servicio ni la exactitud total del contenido publicado. El uso del sitio es bajo responsabilidad del usuario.</p>
        </section>

        <section>
          <h2 className="text-foreground text-lg font-semibold">6. Modificaciones</h2>
          <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entran en vigencia desde su publicación en esta página.</p>
        </section>

        <section>
          <h2 className="text-foreground text-lg font-semibold">7. Legislación Aplicable</h2>
          <p>Estos términos se rigen por las leyes de la República Argentina. Cualquier disputa será sometida a los tribunales competentes.</p>
        </section>
      </div>
    </div>
  </div>
);

export default Terminos;
