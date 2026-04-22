"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import Swal from "sweetalert2";
import { Trash2, Edit3, Search, Package, Plus, Zap, Box, ShoppingCart, Timer } from "lucide-react";
import { EditProductModal } from "@/components/admin/EditProductModal";
import { useProductStore } from "@/store/useProductStore"; 
import { useCategoryStore } from "@/store/useCategoryStore";
import { Product } from "@/types";

interface AdminClientContentProps {
  products: Product[];
  initialCategories: any[];
}

export default function AdminClientContent({ products, initialCategories }: AdminClientContentProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const { setProducts, updateProductInList } = useProductStore();
  const { setCategories } = useCategoryStore();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // --- ESTADO PARA LA TERMINAL DE EVENTOS (Como en tu imagen) ---
  const [events, setEvents] = useState<{msg: string, time: string, type: 'ok' | 'warn'}[]>([]);

  const addEvent = (msg: string, type: 'ok' | 'warn' = 'ok') => {
    const now = new Date().toLocaleTimeString();
    setEvents(prev => [{ msg, time: now, type }, ...prev].slice(0, 4));
  };

  useEffect(() => {
    setProducts(products);
    setCategories(initialCategories);
    addEvent("SISTEMA: Gestión de Inventario Pro Online", "ok");
  }, [products, initialCategories, setProducts, setCategories]);

  // --- LÓGICA DEL SIMULADOR DE VENTA (EL CORAZÓN DEL MÓDULO) ---
  const simulateSale = async (product: any) => {
    if (product.stock <= 0) return Swal.fire("Error", "No hay stock disponible", "error");

    addEvent(`RESERVA: ${product.name} bloqueado por 40s`, "ok");

    // 1. Descontamos visualmente (Reserva)
    const originalStock = product.stock;
    updateProductInList({ ...product, stock: originalStock - 1 });

    const result = await Swal.fire({
      title: 'Simulador Mercado Pago',
      html: `<p>Esperando pago de <b>${product.name}</b>...</p>`,
      icon: 'info',
      timer: 40000,
      timerProgressBar: true,
      showCancelButton: true,
      confirmButtonText: 'Simular Pago Exitoso',
      cancelButtonText: 'Simular Fallo / Tiempo Agotado',
      confirmButtonColor: '#00c1ac',
      cancelButtonColor: '#ff4747',
    });

    if (result.isConfirmed) {
      // ÉXITO: Confirmamos que el pago entró
      addEvent(`VENTA: Pago ID_CONFIRMED para ${product.name}`, "ok");
      Swal.fire("Venta Exitosa", "El stock se ha descontado de la base de datos.", "success");
    } else {
      // FALLO: Rollback de stock (lo que pasará si el webhook de MP no llega)
      updateProductInList({ ...product, stock: originalStock });
      addEvent(`ROLLBACK: Stock devuelto a ${product.name}`, "warn");
      Swal.fire("Pago Cancelado", "El stock ha sido liberado automáticamente.", "error");
    }
  };

  // --- BUSCADOR Y CRUD ---
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    term ? params.set('q', term) : params.delete('q');
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);

  return (
    <div className="p-4 md:p-8 min-h-screen text-[var(--foreground)]">
      
      {/* SECCIÓN DE STATS Y TERMINAL (Tu captura de pantalla) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Terminal de Eventos - Replicando tu imagen */}
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
                  <span className="font-bold opacity-80 uppercase">{ev.type === 'ok' ? 'OK' : 'FAIL'}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Stats Rápidos */}
        <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-[2rem] border border-white/5 bg-slate-900/50 flex flex-col justify-center">
              <p className="text-[10px] font-black uppercase tracking-tighter opacity-40">Total Productos</p>
              <p className="text-3xl font-black">{products.length}</p>
            </div>
            <div className="p-6 rounded-[2rem] border border-white/5 bg-slate-900/50 flex flex-col justify-center">
              <p className="text-[10px] font-black uppercase tracking-tighter opacity-40 text-red-400">Sin Stock</p>
              <p className="text-3xl font-black">{products.filter(p => p.stock <= 0).length}</p>
            </div>
        </div>
      </div>

      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
            Inventario <span className="text-blue-600 text-6xl">.</span>
          </h1>
        </div>
        <button 
          onClick={() => { setSelectedProduct({name:"", price:0, stock:0}); setIsCreating(true); setIsEditModalOpen(true); }}
          className="bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] py-5 px-10 rounded-2xl hover:scale-105 transition-all shadow-xl shadow-blue-600/20"
        >
          Añadir Producto
        </button>
      </div>

      {/* TABLA DE PRODUCTOS CON BOTÓN DE SIMULACIÓN */}
      <div className="rounded-[2.5rem] overflow-hidden border border-white/5 bg-slate-900/20 backdrop-blur-md">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 opacity-50">
              <th className="p-8 text-[10px] font-black uppercase tracking-widest">Producto</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest">Stock</th>
              <th className="p-8 text-[10px] font-black uppercase tracking-widest">Precio</th>
              <th className="p-8 text-right text-[10px] font-black uppercase tracking-widest">Simulador / Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((p: any) => (
              <tr key={p._id} className="hover:bg-white/5 transition-colors">
                <td className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl p-1 flex items-center justify-center border border-white/10">
                       <img src={p.image} className="max-h-full object-contain" alt="" />
                    </div>
                    <span className="font-bold text-sm">{p.name}</span>
                  </div>
                </td>
                <td className="p-8">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${p.stock > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-400'}`}>
                    {p.stock > 0 ? `${p.stock} Disponibles` : 'Agotado'}
                  </span>
                </td>
                <td className="p-8 font-black text-sm">${p.price?.toLocaleString()}</td>
                <td className="p-8">
                  <div className="flex justify-end gap-3">
                    {/* BOTÓN DE SIMULAR VENTA (EL QUE QUERÍAS) */}
                    <button 
                      onClick={() => simulateSale(p)}
                      title="Simular Venta (40s)"
                      className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"
                    >
                      <ShoppingCart size={18} />
                    </button>
                    <button onClick={() => { setSelectedProduct(p); setIsCreating(false); setIsEditModalOpen(true); }} className="p-3 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all">
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
        onUpdate={() => {}} // Aquí va tu handleSubmit original
        isCreating={isCreating} 
      />
    </div>
  );
}