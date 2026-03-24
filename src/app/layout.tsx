  import { Geist, Geist_Mono } from "next/font/google";
  import "./globals.css";
  import { Navbar } from "@/components/layout/Navbar";
  import { Footer } from "@/components/layout/Footer";
  import { CartDrawer } from "@/components/layout/CartDrawer";
  import { getCategoriesServer } from "@/lib/products-server";
  import { Metadata, Viewport } from "next"; // Importamos tipos para SEO
  import { Suspense } from "react";
  
  const geistSans = Geist({ 
    variable: "--font-geist-sans", 
    subsets: ["latin"],
    display: "swap", 
    preload: true 
  });

  const geistMono = Geist_Mono({ 
    variable: "--font-geist-mono", 
    subsets: ["latin"],
    display: "swap",
    preload: true 
  });

  // --- CONFIGURACIÓN DE SEO (Sube el puntaje a 100) ---
  export const metadata: Metadata = {
    title: "TechStore | Lo mejor en Tecnología y Computación",
    description: "Descubre nuestro catálogo de productos de alta tecnología, audio y componentes de PC con envío a todo el país.",
    keywords: ["tecnología", "ecommerce", "computación", "audio", "tech store"],
    authors: [{ name: "TechStore Team" }],
    openGraph: {
      title: "TechStore | Tu tienda de tecnología",
      description: "Equípate con lo mejor. Descuentos exclusivos en nuestra tienda online.",
      type: "website",
    },
  };

  // --- OPTIMIZACIÓN DE VIEWPORT ---
  export const viewport: Viewport = {
    themeColor: "#3483fa", // El color azul de tu marca para la barra del navegador
    width: "device-width",
    initialScale: 1,
  };

  export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const categories = await getCategoriesServer();

    return (
      <html lang="es" className="scroll-smooth" suppressHydrationWarning>
        <body 
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen font-sans`}
        >
          {/* Skip to content: Mejora la accesibilidad para lectores de pantalla */}
          <a href="#main-content" className="sr-only focus:not-sr-only p-4 bg-blue-600 text-white text-center">
            Saltar al contenido principal
          </a>

          <Suspense fallback={<div className="h-20 w-full bg-slate-900" />}>
          <Navbar categories={categories} />
        </Suspense>
          <CartDrawer />

          <main id="main-content" className="flex-1">
            {children}
          </main>

          <Footer />
        </body>
      </html>
    );
  }