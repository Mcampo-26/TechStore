"use client";

import React, { useEffect, useState } from "react";
import { X, Save, PlusCircle, Edit3, Zap, Image as ImageIcon, Check } from "lucide-react";
import { useCategoryStore } from "@/store/useCategoryStore";
import Swal from "sweetalert2";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  setProduct: (product: any) => void;
  onUpdate: (e: any) => void;
  isCreating?: boolean;
}

export const EditProductModal = ({
  isOpen,
  onClose,
  product,
  setProduct,
  onUpdate,
  isCreating = false
}: EditProductModalProps) => {
  const { categories, addCategory } = useCategoryStore();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  useEffect(() => {
    if (isOpen) {
      setIsAddingNew(false);
      setNewCatName("");
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  // --- VALIDACIÓN ANTES DE GUARDAR ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!product.name?.trim() || !product.category || !product.price || product.stock === undefined) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor, completa nombre, categoría, precio y stock.',
        confirmButtonColor: '#2563eb'
      });
      return;
    }

    if (product.isOferta) {
      const desc = Number(product.descuento);
      if (!desc || desc <= 0 || desc > 100) {
        Swal.fire({
          icon: 'warning',
          title: 'Falta el descuento',
          text: 'Si el producto está en oferta, debes ingresar un porcentaje de descuento válido (1-100).',
          confirmButtonColor: '#2563eb'
        });
        return;
      }
    }

    onUpdate(e);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "NEW_CATEGORY") {
      setIsAddingNew(true);
    } else {
      setProduct({ ...product, category: value });
    }
  };

  const handleAddNewCategory = async () => {
    if (!newCatName.trim()) return;
    Swal.fire({ title: 'Guardando categoría...', didOpen: () => Swal.showLoading() });
    const savedCat = await addCategory(newCatName.trim());
    if (savedCat) {
      setProduct({ ...product, category: savedCat.name });
      setIsAddingNew(false);
      setNewCatName("");
      Swal.fire({ icon: 'success', title: 'Categoría creada', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });
    }
  };

  const inputClass = "w-full bg-[var(--card-bg)] text-[var(--foreground)] border-2 border-[var(--border-theme)] rounded-2xl px-5 py-3.5 font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:opacity-30";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col rounded-[3rem] shadow-2xl border border-[var(--border-theme)] bg-[var(--background)]">
        
        {/* HEADER */}
        <div className="p-8 border-b border-[var(--border-theme)] flex justify-between items-center bg-[var(--nav-bg)]">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-500/30">
              {isCreating ? <PlusCircle size={24} /> : <Edit3 size={24} />}
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-[var(--foreground)]">
                {isCreating ? "Nuevo Producto" : "Editar Producto"}
              </h2>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Panel de Control</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-all text-[var(--foreground)] opacity-50">
            <X size={28} />
          </button>
        </div>

        {/* CUERPO */}
        <form className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          {/* SECCIÓN OFERTA */}
          <div className={`p-6 rounded-[2rem] border-2 transition-all ${product.isOferta ? 'bg-blue-600 border-blue-400 shadow-xl shadow-blue-600/20' : 'bg-[var(--card-bg)] border-[var(--border-theme)]'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap size={20} className={product.isOferta ? 'text-white' : 'text-blue-500'} fill={product.isOferta ? "white" : "none"} />
                <span className={`font-black uppercase text-[11px] tracking-widest ${product.isOferta ? 'text-white' : 'text-[var(--foreground)]'}`}>
                  Producto en Oferta
                </span>
              </div>
              <button 
                type="button"
                onClick={() => setProduct({ ...product, isOferta: !product.isOferta })}
                className={`w-14 h-8 rounded-full relative transition-all border-2 ${product.isOferta ? 'bg-white border-transparent' : 'bg-transparent border-[var(--border-theme)]'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${product.isOferta ? 'left-8 bg-blue-600' : 'left-1.5 bg-[var(--foreground)] opacity-20'}`} />
              </button>
            </div>
            {product.isOferta && (
              <div className="mt-6 pt-6 border-t border-white/20">
                <label className="text-[10px] font-black text-white/70 uppercase mb-2 block ml-2">Descuento (%)</label>
                <input type="number" className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-4 py-2.5 text-white font-bold outline-none focus:border-white" value={product.descuento || ""} onChange={(e) => setProduct({ ...product, descuento: Number(e.target.value) })} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase mb-2 block ml-2 tracking-widest opacity-40">Nombre</label>
              <input type="text" className={inputClass} value={product.name || ""} onChange={(e) => setProduct({ ...product, name: e.target.value })} />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-black uppercase mb-2 block ml-2 tracking-widest opacity-40">Categoría</label>
              {!isAddingNew ? (
                <select className={inputClass} value={product.category || ""} onChange={handleCategoryChange}>
                  <option value="">Seleccionar...</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                  <option value="NEW_CATEGORY" className="text-blue-600 font-bold italic">+ Crear Nueva...</option>
                </select>
              ) : (
                <div className="flex gap-2">
                  <input type="text" className={`${inputClass} border-blue-500`} value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="Nombre..." autoFocus />
                  <button type="button" onClick={handleAddNewCategory} className="bg-blue-600 text-white px-4 rounded-2xl hover:bg-blue-700 transition-all">
                    <Check size={20} />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase mb-2 block ml-2 tracking-widest opacity-40">Precio (ARS)</label>
                <input type="number" className={inputClass} value={product.price || ""} onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase mb-2 block ml-2 tracking-widest opacity-40">Stock</label>
                <input type="number" className={inputClass} value={product.stock ?? ""} onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })} />
              </div>
            </div>

            {/* SECCIÓN DE IMÁGENES (Recuperadas) */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase mb-2 block ml-2 tracking-widest opacity-40">Imagen Principal (URL)</label>
                <div className="relative">
                  <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" />
                  <input type="text" className={`${inputClass} pl-12`} value={product.image || ""} onChange={(e) => setProduct({ ...product, image: e.target.value })} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase mb-2 block ml-2 tracking-widest opacity-40">Imagen 2 (Opcional)</label>
                  <input type="text" className={inputClass} value={product.image2 || ""} onChange={(e) => setProduct({ ...product, image2: e.target.value })} placeholder="URL imagen secundaria..." />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase mb-2 block ml-2 tracking-widest opacity-40">Imagen 3 (Opcional)</label>
                  <input type="text" className={inputClass} value={product.image3 || ""} onChange={(e) => setProduct({ ...product, image3: e.target.value })} placeholder="URL imagen terciaria..." />
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase mb-2 block ml-2 tracking-widest opacity-40">Descripción</label>
              <textarea className={`${inputClass} h-32 resize-none`} value={product.description || ""} onChange={(e) => setProduct({ ...product, description: e.target.value })} />
            </div>
          </div>
        </form>

        {/* FOOTER */}
        <div className="p-8 border-t border-[var(--border-theme)] flex gap-4 bg-[var(--nav-bg)]">
          <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 border-[var(--border-theme)] opacity-50 hover:opacity-100 transition-all">
            Descartar
          </button>
          <button 
            type="button" 
            onClick={handleSubmit}
            className="flex-[2] py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-blue-600 text-white shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Save size={18} />
            {isCreating ? "Confirmar y Publicar" : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
};