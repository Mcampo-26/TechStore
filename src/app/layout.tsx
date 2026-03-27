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
import dbConnect from "@/lib/mongodb";

const geistSans = Geist({ 
  variable: "--font-geist-sans", 
  subsets: ["latin"],
  display: "swap", 
});

const geistMono = Geist_Mono({ 
  variable: "--font-geist-mono", 
  subsets: ["latin"],
  display: "swap",
  preload: false, // Desactivamos la precarga para evitar el aviso si no se usa de inmediato
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
  
  dbConnect().catch((err) => console.error("MongoDB Warmup Error:", err));

  const categories = await getCategoriesServer();

  return (
    // CAMBIO: Usamos data-scroll-behavior para que Next.js gestione el scroll correctamente
    <html lang="es" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:," />
      </head>
      {/* CAMBIO: Añadimos geistSans.className para usar la fuente y eliminar avisos de precarga */}
      <body className={`${geistSans.variable} ${geistMono.variable} ${geistSans.className} antialiased flex flex-col min-h-screen font-sans relative`}>
        
        <Suspense fallback={null}>
          <GlobalSpinner />
          <RouteChangeListener />
        </Suspense>

        <a href="#main-content" className="sr-only focus:not-sr-only p-4 bg-blue-600 text-white text-center z-[10000]">
          Saltar al contenido principal
        </a>

        <Suspense fallback={<div className="h-16 w-full bg-[var(--background)] border-b border-[var(--border-theme)]" />}>
          <Navbar categories={categories} />
        </Suspense>

        <CartDrawer />

        <main id="main-content" className="flex-1 w-full relative">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}