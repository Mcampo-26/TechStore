"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import Swal from "sweetalert2";
import { Edit3, Zap, ShoppingCart } from "lucide-react";
import { EditProductModal } from "@/components/admin/EditProductModal";
import { useProductStore } from "@/store/useProductStore"; 
import { useCategoryStore } from "@/store/useCategoryStore";
import { Product } from "@/types";

interface AdminClientContentProps {
  products: Product[];
  initialCategories: any[];
}

export default function AdminClientContent({ 
  products: serverProducts, // Renombramos la prop para evitar confusión
  initialCategories 
}: AdminClientContentProps) {
  
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // --- CONEXIÓN AL STORE (Fuente de verdad reactiva) ---
  const { products, setProducts, updateProductInList } = useProductStore();
  const { setCategories } = useCategoryStore();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [events, setEvents] = useState<{msg: string, time: string, type: 'ok' | 'warn'}[]>([]);

  const addEvent = (msg: string, type: 'ok' | 'warn' = 'ok') => {
    const now = new Date().toLocaleTimeString();
    setEvents(prev => [{ msg, time: now, type }, ...prev].slice(0, 4));
  };

  // --- SINCRONIZACIÓN CRÍTICA ---
  useEffect(() => {
    // Esto inyecta los 56 que ves en Mongo al Store de Zustand
    if (serverProducts) {
      setProducts(serverProducts);
    }
    setCategories(initialCategories);
    addEvent("SISTEMA: Gestión de Inventario Pro Online", "ok");
  }, [serverProducts, initialCategories, setProducts, setCategories]);

  const simulateSale = async (product: any) => {
    if (product.stock <= 0) return Swal.fire("Error", "No hay stock disponible", "error");

    addEvent(`RESERVA: ${product.name} bloqueado`, "ok");
    const originalStock = product.stock;
    
    // Actualización visual inmediata en el Store
    updateProductInList({ ...product, stock: originalStock - 1 });

    const result = await Swal.fire({
      title: 'Simulador Mercado Pago',
      html: `<p>Esperando pago de <b>${product.name}</b>...</p>`,
      icon: 'info',
      timer: 4000,
      timerProgressBar: true,
      showCancelButton: true,
      confirmButtonText: 'Simular Pago Exitoso',
    });

    if (result.isConfirmed) {
      addEvent(`VENTA: Confirmada para ${product.name}`, "ok");
      Swal.fire("Venta Exitosa", "Stock actualizado.", "success");
    } else {
      // Devolvemos al stock original en el Store si se cancela
      updateProductInList({ ...product, stock: originalStock });
      addEvent(`ROLLBACK: Stock liberado`, "warn");
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen text-[var(--foreground)]">
      
      {/* STATS: Usamos 'products' del Store */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="p-8 rounded-[2rem] border bg-slate-900/50 backdrop-blur-xl border-white/5 shadow-2xl">
           <div className="flex items-center gap-2 mb-6">
              <Zap size={18} className="text-blue-500" />
              <h2 className="text-[10px] font-black uppercase tracking-widest opacity-60">Terminal de Eventos</h2>
           </div>
           <div className="space-y-4">
              {events.map((ev, i) => (
                <div key={i} className="flex justify-between items-center text-[11px] font-mono border-b border-white/5 pb-2">
                  <span className="opacity-40">[{ev.time}]</span>
                  <span className={ev.type === 'warn' ? 'text-red-400' : 'text-emerald-400'}>{ev.msg}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-[2rem] border border-white/5 bg-slate-900/50">
              <p className="text-[10px] font-black uppercase opacity-40">Total Productos</p>
              <p className="text-3xl font-black">{products.length}</p>
            </div>
            <div className="p-6 rounded-[2rem] border border-white/5 bg-slate-900/50">
              <p className="text-[10px] font-black uppercase opacity-40 text-red-400">Sin Stock</p>
              <p className="text-3xl font-black">{products.filter(p => p.stock <= 0).length}</p>
            </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
          Inventario <span className="text-blue-600 text-6xl">.</span>
        </h1>
        <button 
          onClick={() => { setSelectedProduct({name:"", price:0, stock:0}); setIsCreating(true); setIsEditModalOpen(true); }}
          className="bg-blue-600 text-white font-black text-xs uppercase py-5 px-10 rounded-2xl shadow-xl shadow-blue-600/20"
        >
          Añadir Producto
        </button>
      </div>

      <div className="rounded-[2.5rem] overflow-hidden border border-white/5 bg-slate-900/20 backdrop-blur-md">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 opacity-50 font-black text-[10px] uppercase tracking-widest">
              <th className="p-8">Producto</th>
              <th className="p-8">Stock Real</th>
              <th className="p-8">Precio</th>
              <th className="p-8 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((p: any) => (
              <tr key={p._id} className="hover:bg-white/5 transition-colors">
                <td className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl p-1 flex items-center justify-center border border-white/10 overflow-hidden">
                       <img src={p.image} className="max-h-full object-contain" alt="" />
                    </div>
                    <span className="font-bold text-sm">{p.name}</span>
                  </div>
                </td>
                <td className="p-8">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${p.stock > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-400'}`}>
                    {/* Aquí ahora dirá 56 como en Mongo */}
                    {p.stock > 0 ? `${p.stock} Disponibles` : 'Agotado'}
                  </span>
                </td>
                <td className="p-8 font-black text-sm">${p.price?.toLocaleString()}</td>
                <td className="p-8 text-right">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => simulateSale(p)} className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white">
                      <ShoppingCart size={18} />
                    </button>
                    <button onClick={() => { setSelectedProduct(p); setIsCreating(false); setIsEditModalOpen(true); }} className="p-3 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white">
                      <Edit3 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditProductModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        product={selectedProduct} 
        setProduct={setSelectedProduct} 
        onUpdate={() => replace(pathname)} 
        isCreating={isCreating} 
      />
    </div>
  );
}