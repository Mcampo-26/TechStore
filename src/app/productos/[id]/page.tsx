import { getProductById } from "@/lib/products-server";
import ProductoDetalleClient from "./ProductoDetalleClient";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductoDetallePage({ params }: PageProps) {
  // En Next.js 15, params es una Promise, por eso usamos await.
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <Suspense fallback={<LoadingState />}>
      {/* Usamos 'product' como nombre de la prop */}
      <ProductoDetalleClient product={product} />
    </Suspense>
  );
}

function LoadingState() {
  return (
    <div 
      className="h-screen flex items-center justify-center transition-colors duration-300"
      style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black tracking-[0.3em] animate-pulse uppercase">
          Cargando Producto...
        </p>
      </div>
    </div>
  );
}