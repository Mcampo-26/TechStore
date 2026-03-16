"use client";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Trash2, Edit3, Search, Package, Plus, Zap, Box } from "lucide-react";
import { EditProductModal } from "@/components/admin/EditProductModal";
import { useProductStore } from "@/store/useProductStore"; 
import { Product } from "@/types";

interface Props {
  initialProducts: Product[];
}

// Estado inicial para nuevos productos
const initialProductState = {
  name: "",
  price: 0,
  category: "",
  stock: 0,
  description: "",
  image: "",
  image2: "",
  image3: "",
  isOferta: false,
  descuento: 0
};

export default function AdminClientContent({ initialProducts }: Props) {
  const { products, setProducts, updateProductInList } = useProductStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Sincronizar el store con los datos del servidor al cargar
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts, setProducts]);

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
    
    // Loader de carga
    Swal.fire({
      title: isCreating ? 'Creando...' : 'Actualizando...',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

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
        
        if (isCreating) {
          // Si creamos, añadimos al inicio de la lista local
          setProducts([result, ...products]);
        } else {
          // Si editamos, usamos la función del store
          updateProductInList(result);
        }

        Swal.fire({
          title: "¡Éxito!",
          text: isCreating ? "Producto creado correctamente" : "Producto actualizado",
          icon: "success",
          confirmButtonColor: "#3483fa"
        });
        setIsEditModalOpen(false);
      } else {
        Swal.fire("Error", "No se pudo guardar en la base de datos", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Error de conexión con el servidor", "error");
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
      Swal.fire({ title: "Eliminando...", didOpen: () => { Swal.showLoading(); } });
  
      try {
        const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
        if (res.ok) {
          const updatedProducts = products.filter((p: any) => p._id !== id);
          setProducts(updatedProducts);
          Swal.fire("Eliminado", "El producto ha sido borrado", "success");
        } else {
          throw new Error();
        }
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el producto", "error");
      }
    }
  };

  const filteredProducts = products.filter((p: any) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* --- STATS MINI PANEL --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
              { label: 'Total Productos', value: products.length, icon: Package, color: 'text-blue-500' },
              { label: 'En Oferta', value: products.filter((p:any) => p.isOferta).length, icon: Zap, color: 'text-emerald-500' },
              { label: 'Sin Stock', value: products.filter((p:any) => p.stock <= 0).length, icon: Box, color: 'text-red-500' }
          ].map((stat, i) => (
              <div key={i} className="p-6 rounded-[2rem] border flex items-center gap-5 transition-all shadow-sm"
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
          className="group relative flex items-center justify-center gap-3 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] py-5 px-10 rounded-2xl shadow-2xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus size={18} /> Añadir Producto
        </button>
      </div>

      {/* --- BUSCADOR --- */}
      <div className="relative group mb-12">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none opacity-40">
              <Search size={22} />
          </div>
          <input 
              type="text" 
              placeholder="Filtrar por nombre..."
              className="w-full pl-16 pr-8 py-6 rounded-[2rem] border-2 outline-none font-bold text-lg transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          />
      </div>

      {/* --- LISTADO DE PRODUCTOS --- */}
      <div className="rounded-[2.5rem] overflow-hidden border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-theme)] opacity-50">
              <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest">Producto</th>
              <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest">Estado</th>
              <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest">Precio</th>
              <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-theme)]">
            {filteredProducts.map((p: any) => (
              <tr key={p._id} className="hover:bg-slate-500/5 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <img src={p.image} className="w-12 h-12 object-contain rounded-xl bg-white p-1 border" alt={p.name} />
                    <div>
                      <p className="font-bold text-sm leading-tight">{p.name}</p>
                      <p className="text-[10px] font-bold text-blue-500 uppercase">{p.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  {p.stock > 0 ? (
                    <span className="text-[9px] font-black px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full uppercase italic">En Stock ({p.stock})</span>
                  ) : (
                    <span className="text-[9px] font-black px-3 py-1 bg-red-500/10 text-red-500 rounded-full uppercase italic">Agotado</span>
                  )}
                </td>
                <td className="px-8 py-6 font-black text-sm">
                  ${p.price?.toLocaleString()}
                </td>
                <td className="px-8 py-6">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEditClick(p)} className="p-3 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => handleDelete(p._id, p.name)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 size={18} />
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
        onUpdate={handleSubmit} 
        isCreating={isCreating} 
      />
    </>
  );
}