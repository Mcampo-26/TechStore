// src/app/admin/products/page.tsx
import { Product } from "@/types";
import AdminClientContent from "./AdminClientContent";

// Función para traer datos directamente (sin pasar por API Route si no quieres)
async function getProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, { 
    cache: 'no-store' // Para que siempre traiga datos frescos
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function AdminPage() {
  const initialProducts = await getProducts();

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-10" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Pasamos los productos ya cargados al cliente */}
        <AdminClientContent initialProducts={initialProducts} />
      </div>
    </div>
  );
}