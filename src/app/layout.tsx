import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tech Store | Premium E-commerce",
  description: "Tu tienda de tecnología de alto rendimiento",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050505] text-slate-900 flex flex-col min-h-screen`}
      >
        {/* El Navbar solo se declara aquí una vez para toda la app */}
        <Navbar />
        
        {/* flex-1 asegura que este main crezca y empuje al footer al final */}
        <main className="flex-1 pt-20">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}