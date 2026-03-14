import { lazy, Suspense } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Publicidad from "@/components/landing/Publicidad";
import PopupAd from "@/components/landing/PopupAd";
import CookieConsent from "@/components/landing/CookieConsent";

const Programa = lazy(() => import("@/components/landing/Programa"));
const Galeria = lazy(() => import("@/components/landing/Galeria"));
const Estadisticas = lazy(() => import("@/components/landing/Estadisticas"));
const Fechas = lazy(() => import("@/components/landing/Fechas"));
const Noticias = lazy(() => import("@/components/landing/Noticias"));
const Reportajes = lazy(() => import("@/components/landing/Reportajes"));
const Tienda = lazy(() => import("@/components/landing/Tienda"));
const Contacto = lazy(() => import("@/components/landing/Contacto"));
const Footer = lazy(() => import("@/components/landing/Footer"));

const SectionLoader = () => (
  <div className="flex justify-center py-20">
    <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

const Index = () => (
  <div className="min-h-screen bg-background overflow-x-hidden">
    <Navbar />
    <Hero />
    <Publicidad />
    <Suspense fallback={<SectionLoader />}>
      <Programa />
    </Suspense>
    <Suspense fallback={<SectionLoader />}>
      <Galeria />
    </Suspense>
    <Suspense fallback={<SectionLoader />}>
      <Estadisticas />
    </Suspense>
    <Suspense fallback={<SectionLoader />}>
      <Fechas />
    </Suspense>
    <Suspense fallback={<SectionLoader />}>
      <Noticias />
    </Suspense>
    <Suspense fallback={<SectionLoader />}>
      <Reportajes />
    </Suspense>
    <Suspense fallback={null}>
      <Tienda />
      <Contacto />
      <Footer />
    </Suspense>
    <PopupAd />
    <CookieConsent />
  </div>
);

export default Index;
