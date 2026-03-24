import { getProductById } from "@/lib/products-server";
import ProductoDetalleClient from "./ProductoDetalleClient";
import { notFound } from "next/navigation";
import { Product } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductoDetallePage({ params }: PageProps) {
  // 1. Resolvemos los params de Next.js 15
  const { id } = await params;
  
  // 2. Traemos los datos directamente (Server Side)
  const rawProduct = await getProductById(id);

  if (!rawProduct) {
    notFound();
  }

  // 3. Limpieza de tipos para TypeScript (MongoDB null -> undefined)
  const product: Product = {
    ...rawProduct,
    _id: String(rawProduct._id),
    image2: rawProduct.image2 ?? undefined,
    image3: rawProduct.image3 ?? undefined,
  } as any;

  // 4. Retornamos el componente directamente. 
  // Next.js usará automáticamente tu 'loading.tsx' mientras esto carga.
  return <ProductoDetalleClient product={product} />;
}