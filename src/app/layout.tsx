// app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";

// Configuración optimizada de fuentes para evitar errores de precarga
const geistSans = Geist({ 
  variable: "--font-geist-sans", 
  subsets: ["latin"],
  display: "swap", // 👈 Crucial para que el navegador no ignore la fuente precargada
  preload: true 
});

const geistMono = Geist_Mono({ 
  variable: "--font-geist-mono", 
  subsets: ["latin"],
  display: "swap",
  preload: true 
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen font-sans`}
      >
        <Navbar />
        
        {/* El Drawer siempre vive aquí, él mismo decide si mostrarse o no */}
        <CartDrawer />

        <main className="flex-1">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}