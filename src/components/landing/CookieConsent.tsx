import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie_consent");
    if (!accepted) {
      const t = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "true");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4"
        >
          <div className="max-w-3xl mx-auto bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row items-center gap-3 shadow-lg">
            <p className="text-muted-foreground text-xs flex-1">
              Usamos cookies para mejorar tu experiencia. Al continuar navegando, aceptás nuestra{" "}
              <a href="/privacidad" className="text-primary underline">Política de Privacidad</a>.
            </p>
            <button
              onClick={accept}
              className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-xs font-semibold hover:bg-primary/90 whitespace-nowrap"
            >
              Aceptar
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
