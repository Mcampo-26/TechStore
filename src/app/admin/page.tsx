"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Trash2, Edit3, Search, Package, Plus, Loader2, Zap, ArrowUpRight, Box } from "lucide-react";
import { EditProductModal } from "@/components/admin/EditProductModal";
import { useProductStore } from "@/store/useProductStore"; 

export default function AdminPage() {
  const { products, setProducts, isLoading, setLoading, updateProductInList } = useProductStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const initialProductState = {
    name: "", price: 0, stock: 0, category: "", 
    image: "", image2: "", image3: "",
    description: "", isOferta: false, descuentoPorcentaje: 0
  };

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) { 
      console.error("Error al obtener productos:", error); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchProductos(); }, []);

  const handleCreateClick = () => {
    setSelectedProduct({ ...initialProductState });
    setIsCreating(true);
    setIsEditModalOpen(true);
  };

  const handleEditClick = (product: any) => {
    setSelectedProduct({ ...product });
    setIsCreating(false);
    setIsEditModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isCreating ? "POST" : "PUT";
    const url = isCreating ? "/api/products" : `/api/products/${selectedProduct._id}`;

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedProduct),
      });

      if (res.ok) {
        const result = await res.json();
        if (isCreating) { fetchProductos(); } 
        else { updateProductInList(result); }
        Swal.fire({
          title: "¡Éxito!",
          text: isCreating ? "Producto creado" : "Producto actualizado",
          icon: "success",
          confirmButtonColor: "#3483fa"
        });
        setIsEditModalOpen(false);
      } else {
        Swal.fire("Error", "No se pudo guardar", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Error de conexión", "error");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: `¿Eliminar "${name}"?`,
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3483fa",
      cancelButtonColor: "#ff4747",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });
  
    if (result.isConfirmed) {
      Swal.fire({ title: "Procesando...", didOpen: () => { Swal.showLoading(); } });
  
      setTimeout(() => {
        const updatedProducts = products.filter((p: any) => p._id !== id);
        setProducts(updatedProducts);
        Swal.fire({
          title: "Borrado Simulado",
          html: `<p>El producto <b>${name}</b> se quitó de la vista actual.</p>`,
          icon: "info",
          confirmButtonColor: "#3483fa",
        });
      }, 800);
    }
  };

  const filteredProducts = products.filter((p: any) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-10" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto">
        
        {/* --- STATS MINI PANEL --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
                { label: 'Total Productos', value: products.length, icon: Package, color: 'text-blue-500' },
                { label: 'En Oferta', value: products.filter((p:any) => p.isOferta).length, icon: Zap, color: 'text-emerald-500' },
                { label: 'Sin Stock', value: products.filter((p:any) => p.stock <= 0).length, icon: Box, color: 'text-red-500' }
            ].map((stat, i) => (
                <div key={i} className="p-6 rounded-[2rem] border flex items-center gap-5 transition-all"
                     style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
                    <div className={`p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 ${stat.color}`}>
                        <stat.icon size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40" style={{color: 'var(--foreground)'}}>{stat.label}</p>
                        <p className="text-2xl font-black" style={{color: 'var(--foreground)'}}>{stat.value}</p>
                    </div>
                </div>
            ))}
        </div>

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-[2px] bg-blue-600 rounded-full"></span>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Gestión de Catálogo</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter" style={{ color: 'var(--foreground)' }}>
              Inventario <span className="text-blue-600">Control.</span>
            </h1>
          </div>

          <button 
            onClick={handleCreateClick}
            className="group relative flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-[0.2em] py-5 px-10 rounded-2xl transition-all overflow-hidden shadow-2xl shadow-blue-600/20 active:scale-95"
          >
            <Plus size={18} className="group-hover:rotate-180 transition-transform duration-500" />
            Añadir Producto
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
          </button>
        </div>

        {/* --- BUSCADOR PREMIUM --- */}
        <div className="relative group mb-12">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none opacity-40 group-focus-within:opacity-100 group-focus-within:text-blue-600 transition-all">
                <Search size={22} />
            </div>
            <input 
                type="text" 
                placeholder="Filtrar por nombre de producto..."
                className="w-full pl-16 pr-8 py-6 rounded-[2rem] border-2 outline-none font-bold text-lg transition-all"
                style={{ 
                    backgroundColor: 'var(--card-bg)', 
                    borderColor: 'var(--border-theme)', 
                    color: 'var(--foreground)'
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute right-6 inset-y-0 flex items-center">
                <kbd className="hidden sm:inline-block px-3 py-1 text-[10px] font-black rounded-lg border opacity-30" style={{borderColor: 'var(--border-theme)', color: 'var(--foreground)'}}>CTRL + K</kbd>
            </div>
        </div>

        {/* --- LISTADO --- */}
        <div className="rounded-[2.5rem] overflow-hidden border transition-all shadow-2xl shadow-black/5"
             style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
          
          <div className="hidden md:block">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-[0.3em] border-b"
                    style={{ color: 'var(--foreground)', borderColor: 'var(--border-theme)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                  <th className="px-10 py-6">Detalles del Producto</th>
                  <th className="px-10 py-6">Estado / Stock</th>
                  <th className="px-10 py-6">Precio Unitario</th>
                  <th className="px-10 py-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-theme)' }}>
                {isLoading ? (
                  <tr><td colSpan={4} className="py-32 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={40} /></td></tr>
                ) : filteredProducts.map((p: any) => (
                  <tr key={p._id} className="group hover:bg-slate-500/5 transition-all">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-white rounded-3xl p-3 flex-shrink-0 shadow-inner group-hover:rotate-2 transition-transform">
                          <img src={p.image} className="w-full h-full object-contain" alt="" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-lg font-black tracking-tight" style={{ color: 'var(--foreground)' }}>{p.name}</span>
                          <span className="text-[10px] uppercase font-bold opacity-40" style={{color: 'var(--foreground)'}}>{p.category || 'Sin categoría'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${p.stock > 0 ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`}></div>
                                <span className="text-xs font-black uppercase tracking-widest" style={{color: 'var(--foreground)'}}>{p.stock} DISPONIBLES</span>
                            </div>
                            {p.isOferta && (
                                <span className="w-fit flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase italic tracking-tighter border border-emerald-500/20">
                                    <Zap size={10} fill="currentColor" /> {p.descuentoPorcentaje || p.descuento}% OFF
                                </span>
                            )}
                        </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col leading-none">
                        <span className="text-2xl font-black text-blue-600">$ {p.price.toLocaleString('es-AR')}</span>
                        <span className="text-[9px] font-bold opacity-30 mt-1 uppercase" style={{color: 'var(--foreground)'}}>ARS Final</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <button onClick={() => handleEditClick(p)} 
                                className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 hover:shadow-lg transition-all active:scale-90"><Edit3 size={18} /></button>
                        <button onClick={() => handleDelete(p._id, p.name)} 
                                className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-90"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* VISTA MÓVIL RE-DISEÑADA */}
          <div className="md:hidden divide-y" style={{ borderColor: 'var(--border-theme)' }}>
            {isLoading ? (
               <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></div>
            ) : filteredProducts.map((p: any) => (
              <div key={p._id} className="p-6 flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white rounded-3xl p-3 flex-shrink-0 shadow-sm border border-slate-100">
                    <img src={p.image} className="w-full h-full object-contain" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-black leading-tight truncate" style={{ color: 'var(--foreground)' }}>{p.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xl font-black text-blue-600">$ {p.price.toLocaleString('es-AR')}</span>
                        {p.isOferta && <span className="bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">-{p.descuentoPorcentaje}%</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleEditClick(p)} className="flex-1 py-4 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2"><Edit3 size={14} /> Editar</button>
                  <button onClick={() => handleDelete(p._id, p.name)} className="flex-1 py-4 bg-red-500/10 text-red-500 font-black text-[10px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2"><Trash2 size={14} /> Borrar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <EditProductModal 
        isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} 
        product={selectedProduct} setProduct={setSelectedProduct} 
        onUpdate={handleSubmit} isCreating={isCreating} 
      />
    </div>
  );
}