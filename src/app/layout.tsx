import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { getCategoriesServer } from "@/lib/products-server";
import { Metadata, Viewport } from "next";
import { Suspense } from "react";
import RouteChangeListener from "@/components/layout/RouteChangeListener";
import GlobalSpinner from "@/components/layout/GlobalSpinner";

const geistSans = Geist({ 
  variable: "--font-geist-sans", 
  subsets: ["latin"],
  display: "swap", 
});

const geistMono = Geist_Mono({ 
  variable: "--font-geist-mono", 
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TechStore | Lo mejor en Tecnología y Computación",
  description: "Descubre nuestro catálogo de productos de alta tecnología, audio y componentes de PC con envío a todo el país.",
  keywords: ["tecnología", "ecommerce", "computación", "audio", "tech store"],
  openGraph: {
    title: "TechStore | Tu tienda de tecnología",
    description: "Equípate con lo mejor. Descuentos exclusivos.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#3483fa",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetch de categorías en el servidor
  const categories = await getCategoriesServer();

  return (
    <html lang="es" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* 🛑 BLOQUEO DE FAVICON: Mata la petición automática del navegador para evitar el error 404 extra */}
        <link rel="icon" href="data:," />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen font-sans relative`}>
        
        {/* SPINNER Y LISTENER: Envolvamos en Suspense para que no bloqueen la hidratación del 404 */}
        <Suspense fallback={null}>
          <GlobalSpinner />
          <RouteChangeListener />
        </Suspense>

        <a href="#main-content" className="sr-only focus:not-sr-only p-4 bg-blue-600 text-white text-center z-[10000]">
          Saltar al contenido principal
        </a>

        {/* NAVBAR: Con su propio Suspense para carga asíncrona */}
        <Suspense fallback={<div className="h-16 w-full bg-[var(--background)] border-b border-[var(--border-theme)]" />}>
          <Navbar categories={categories} />
        </Suspense>

        <CartDrawer />

        {/* CONTENEDOR PRINCIPAL: Usamos flex-1 para empujar el footer al fondo */}
        <main id="main-content" className="flex-1 w-full relative">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}