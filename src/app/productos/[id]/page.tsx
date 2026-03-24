import { getProductById } from "@/lib/products-server";
import ProductoDetalleClient from "./ProductoDetalleClient";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Product } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Componente interno que realiza la carga de datos.
 * Al estar dentro de Suspense, permite que el fallback se muestre de inmediato.
 */
async function ProductFetcher({ id }: { id: string }) {
  const rawProduct = await getProductById(id);

  if (!rawProduct) {
    notFound();
  }

  // Saneamiento de datos para TypeScript:
  // MongoDB devuelve null para campos vacíos, pero nuestra interfaz Product usa undefined.
  const product: Product = {
    ...rawProduct,
    _id: String(rawProduct._id),
    image2: rawProduct.image2 ?? undefined,
    image3: rawProduct.image3 ?? undefined,
  } as any; // Cast final para asegurar compatibilidad con la interfaz Product

  return <ProductoDetalleClient product={product} />;
}

export default async function ProductoDetallePage({ params }: PageProps) {
  // En Next.js 15, params se debe resolver con await
  const { id } = await params;

  return (
    // El Suspense envuelve al componente que hace el fetch
    <Suspense fallback={<LoadingState />}>
      <ProductFetcher id={id} />
    </Suspense>
  );
}

function LoadingState() {
  return (
    <div 
      className="h-screen flex items-center justify-center bg-[var(--background)] transition-colors duration-300"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Spinner estilizado acorde a tu UI */}
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 border-4 border-blue-600/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-[10px] font-black tracking-[0.4em] text-blue-600 animate-pulse uppercase">
          Cargando Producto...
        </p>
      </div>
    </div>
  );
}