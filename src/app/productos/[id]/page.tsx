import { getProductById, getProductsServer } from "@/lib/products-server"; // Importación faltante
import ProductoDetalleClient from "./ProductoDetalleClient";
import { notFound } from "next/navigation";
import { Product } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

// ESTO ES LO QUE HACE QUE SEA INSTANTÁNEO
export async function generateStaticParams() {
  try {
    const products = await getProductsServer();
    
    // Si tu carpeta es [id], devolvemos el objeto con la propiedad id
    return products.map((product: any) => ({
      id: product._id.toString(),
    }));
  } catch (error) {
    console.error("Error en generateStaticParams:", error);
    return [];
  }
}

export default async function ProductoDetallePage({ params }: PageProps) {
  // 1. Resolvemos los params de Next.js 15
  const { id } = await params;
  
  // 2. Traemos los datos directamente (Server Side)
  const rawProduct = await getProductById(id);

  if (!rawProduct) {
    notFound();
  }

  // 3. Limpieza de tipos y compatibilidad (Aseguramos que no viajen nulls molestos)
  const product: Product = {
    ...rawProduct,
    _id: String(rawProduct._id),
    image: rawProduct.image || undefined,
    image2: rawProduct.image2 || undefined,
    image3: rawProduct.image3 || undefined,
    description: rawProduct.description || "",
  } as any;

  // 4. Renderizado
  return (
    <main className="min-h-screen bg-[var(--background)]">
       <ProductoDetalleClient product={product} />
    </main>
  );
}