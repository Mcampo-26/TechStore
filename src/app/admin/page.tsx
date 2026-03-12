"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Trash2, Edit3, Search, Package, Plus, Loader2 } from "lucide-react";
import { EditProductModal } from "@/components/admin/EditProductModal";
// Importamos tu store de productos
import { useProductStore } from "@/store/useProductStore"; 

export default function AdminPage() {
  // Extraemos las funciones y estados de tu ProductState
  const { products, setProducts, isLoading, setLoading, updateProductInList } = useProductStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const initialProductState = {
    name: "", 
    price: 0, 
    stock: 0, 
    image: "", 
    image2: "", 
    image3: "",
    description: "",
    isOferta: false, 
    descuentoPorcentaje: 0
  };

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data); // Actualizamos el store global
    } catch (error) { 
      console.error("Error al obtener productos:", error); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    fetchProductos(); 
  }, []);

  // --- LOGICA BOTONES ---
  const handleCreateClick = () => {
    setSelectedProduct(initialProductState);
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
        
        if (isCreating) {
          fetchProductos(); // Recargamos la lista completa si es nuevo
        } else {
          updateProductInList(result); // Actualizamos solo ese producto en la UI
        }

        Swal.fire("¡Éxito!", isCreating ? "Producto creado" : "Producto actualizado", "success");
        setIsEditModalOpen(false);
      } else {
        Swal.fire("Error", "No se pudo guardar los cambios", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Error de conexión", "error");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: `¿Eliminar "${name}"?`,
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
          fetchProductos(); // Refrescamos la lista del store
          Swal.fire("Eliminado", "Producto borrado con éxito", "success");
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
    <div className="min-h-screen bg-[#ebebeb] pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER CON BOTÓN AGREGAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-[#3483fa] p-2 rounded-lg">
              <Package className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Panel <span className="text-[#3483fa]">Admin</span>
            </h1>
          </div>

          {/* AQUÍ ESTÁ EL BOTÓN QUE FALTABA */}
          <button 
            onClick={handleCreateClick}
            className="flex items-center justify-center gap-2 bg-[#3483fa] hover:bg-[#2968c8] text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md shadow-blue-200"
          >
            <Plus size={20} />
            Nuevo Producto
          </button>
        </div>

        {/* BUSCADOR */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex items-center gap-3 border border-gray-200 focus-within:border-[#3483fa] transition-all">
          <Search className="text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nombre..."
            className="w-full outline-none text-gray-600 bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* TABLA USANDO EL STORE */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="py-20 text-center text-gray-400">
                    <Loader2 className="animate-spin mx-auto mb-2" />
                    Cargando inventario...
                  </td>
                </tr>
              ) : filteredProducts.map((p: any) => (
                <tr key={p._id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white border border-gray-100 rounded-lg p-1">
                      <img src={p.image} className="w-full h-full object-contain" alt="" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{p.name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">$ {p.price.toLocaleString('es-AR')}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => handleEditClick(p)} className="p-2 text-[#3483fa] hover:bg-blue-50 rounded-full transition-all">
                        <Edit3 size={20} />
                      </button>
                      <button onClick={() => handleDelete(p._id, p.name)} className="p-2 text-red-400 hover:bg-red-50 rounded-full transition-all">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EditProductModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        product={selectedProduct} 
        setProduct={setSelectedProduct} 
        onUpdate={handleSubmit} 
        isCreating={isCreating} 
      />
    </div>
  );
}