import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { getCategoriesServer } from "@/lib/products-server";

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Obtenemos las categorías directamente desde la base de datos (Server Side)
  const categories = await getCategoriesServer();

  return (
    <html lang="es" className="scroll-smooth" suppressHydrationWarning>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen font-sans`}
      >
        {/* Pasamos las categorías al Navbar como props */}
        <Navbar categories={categories} />
        
        <CartDrawer />

        <main className="flex-1">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}