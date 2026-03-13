"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Trash2, Edit3, Search, Package, Plus, Loader2, Zap } from "lucide-react";
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
        Swal.fire("¡Éxito!", isCreating ? "Producto creado" : "Producto actualizado", "success");
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
      confirmButtonText: "Sí, eliminar"
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
        if (res.ok) {
          fetchProductos(); 
          Swal.fire("Eliminado", "Producto borrado", "success");
        }
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar", "error");
      }
    }
  };

  const filteredProducts = products.filter((p: any) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-20 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER RESPONSIVE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-[#3483fa] p-2.5 rounded-2xl shadow-lg shadow-blue-100">
              <Package className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Inventario</h1>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Panel de Control</p>
            </div>
          </div>

          <button 
            onClick={handleCreateClick}
            className="flex items-center justify-center gap-2 bg-[#3483fa] hover:bg-[#2968c8] text-white font-black text-sm uppercase tracking-wider py-4 px-6 rounded-2xl transition-all shadow-xl shadow-blue-200 active:scale-95"
          >
            <Plus size={20} />
            Nuevo Producto
          </button>
        </div>

        {/* BUSCADOR */}
        <div className="bg-white p-2 rounded-2xl shadow-sm mb-8 flex items-center gap-3 border border-gray-100 focus-within:ring-2 focus-within:ring-[#3483fa]/20 transition-all">
          <div className="pl-4 text-gray-400"><Search size={20} /></div>
          <input 
            type="text" 
            placeholder="Buscar por nombre..."
            className="w-full py-3 outline-none text-gray-600 bg-transparent font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* CONTENEDOR DE TABLA / CARDS */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          
          {/* VISTA ESCRITORIO (TABLA) - Se oculta en móviles */}
          <div className="hidden md:block">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  <th className="px-8 py-5">Producto</th>
                  <th className="px-8 py-5">Precio</th>
                  <th className="px-8 py-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr><td colSpan={3} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" /></td></tr>
                ) : filteredProducts.map((p: any) => (
                  <tr key={p._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gray-50 rounded-xl p-2 flex-shrink-0 group-hover:scale-110 transition-transform">
                          <img src={p.image} className="w-full h-full object-contain" alt="" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-800">{p.name}</span>
                          {p.isOferta && (
                            <span className="flex items-center gap-1 text-[9px] text-blue-600 font-black uppercase tracking-tighter">
                              <Zap size={10} fill="currentColor" /> {p.descuentoPorcentaje}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-black text-gray-900">$ {p.price.toLocaleString('es-AR')}</td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEditClick(p)} className="p-2.5 text-[#3483fa] hover:bg-blue-50 rounded-xl transition-all"><Edit3 size={18} /></button>
                        <button onClick={() => handleDelete(p._id, p.name)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* VISTA MÓVIL (CARDS) - Se oculta en escritorio */}
          <div className="md:hidden divide-y divide-gray-100">
            {isLoading ? (
               <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" /></div>
            ) : filteredProducts.map((p: any) => (
              <div key={p._id} className="p-5 flex items-center justify-between gap-4 active:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl p-2 flex-shrink-0">
                    <img src={p.image} className="w-full h-full object-contain" alt="" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">{p.name}</h3>
                    <p className="text-blue-600 font-black text-sm">$ {p.price.toLocaleString('es-AR')}</p>
                    {p.isOferta && <span className="text-[9px] font-black text-white bg-blue-500 px-1.5 py-0.5 rounded-md uppercase italic">Oferta</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleEditClick(p)} className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Edit3 size={18} /></button>
                  <button onClick={() => handleDelete(p._id, p.name)} className="p-3 bg-red-50 text-red-500 rounded-2xl"><Trash2 size={18} /></button>
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