"use client";

import React, { useEffect, useState } from 'react';
import { X, Save, Plus, Image as ImageIcon, Tag, Zap, Percent, Edit3, PlusCircle, LayoutGrid, Package, Info } from 'lucide-react';
import { useCategoryStore } from '@/store/useCategoryStore';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  setProduct: (product: any) => void;
  onUpdate: (e: React.FormEvent) => void;
  isCreating?: boolean;
}

export const EditProductModal = ({ isOpen, onClose, product, setProduct, onUpdate, isCreating = false }: EditProductModalProps) => {
  
  const { categories, fetchCategories, addCategory } = useCategoryStore();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  useEffect(() => {
    if (isOpen) {
      console.log("📂 [MODAL] Abierto con producto:", product);
      fetchCategories();
      setIsAddingNew(false);
    }
  }, [isOpen, product, fetchCategories]);

  if (!isOpen || !product) return null;

  const handleFieldChange = (field: string, value: any) => {
    console.log(`✍️ [MODAL] Editando campo: ${field} ->`, value);
    setProduct({ ...product, [field]: value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "NEW_CATEGORY") {
      setIsAddingNew(true);
    } else {
      handleFieldChange('category', value);
    }
  };

  const handleAddNewCategory = async () => {
    if (!newCatName.trim()) return;
    const savedCategory = await addCategory(newCatName);
    if (savedCategory) {
      handleFieldChange('category', savedCategory.name);
      setIsAddingNew(false);
      setNewCatName("");
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    console.log("💾 [MODAL] Click en GUARDAR. Objeto final enviado:", product);
    onUpdate(e);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <div className="rounded-[2.5rem] border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col transition-all"
           style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-theme)' }}>
        
        {/* HEADER ESTILO PREMIUM */}
        <div className="p-8 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-theme)' }}>
          <div className="flex items-center gap-4">
            <div className="bg-blue-600/10 p-3 rounded-2xl text-blue-600 border" style={{ borderColor: 'var(--border-theme)' }}>
              {isCreating ? <PlusCircle size={24} /> : <Edit3 size={24} />}
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-widest" style={{ color: 'var(--foreground)' }}>
                {isCreating ? 'Nuevo Item' : 'Editor de Producto'}
              </h2>
              <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.2em]" style={{ color: 'var(--foreground)' }}>
                Gestión de Inventario TechStore
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-colors opacity-50 hover:opacity-100">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          {/* SECCIÓN: OFERTA RELÁMPAGO */}
          <div className={`p-6 rounded-[2rem] border-2 transition-all ${product.isOferta ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/20' : 'bg-transparent border-dashed opacity-60'}`}
               style={{ borderColor: product.isOferta ? '' : 'var(--border-theme)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${product.isOferta ? 'bg-white text-blue-600' : 'bg-gray-500/10 text-gray-500'}`}>
                  <Zap size={20} fill="currentColor" />
                </div>
                <div>
                  <h3 className={`font-black uppercase tracking-widest text-sm ${product.isOferta ? 'text-white' : ''}`} style={{ color: !product.isOferta ? 'var(--foreground)' : '' }}>
                    Oferta Relámpago
                  </h3>
                  <p className={`text-[9px] font-bold uppercase tracking-widest ${product.isOferta ? 'text-blue-100' : 'opacity-40'}`} style={{ color: !product.isOferta ? 'var(--foreground)' : '' }}>
                    Visibilidad prioritaria en tienda
                  </p>
                </div>
              </div>
              
              <button 
                type="button"
                onClick={() => handleFieldChange('isOferta', !product.isOferta)}
                className={`w-14 h-7 rounded-full relative transition-all border-2 ${product.isOferta ? 'bg-white border-white' : 'bg-transparent border-current opacity-20'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${product.isOferta ? 'left-8 bg-blue-600' : 'left-1 bg-current'}`} />
              </button>
            </div>

            {product.isOferta && (
              <div className="mt-6 pt-6 border-t border-white/20 animate-in fade-in zoom-in-95">
                <label className="text-[10px] font-black text-white uppercase mb-2 tracking-[0.2em] flex items-center gap-2">
                  <Percent size={12} /> Descuento Aplicado (%)
                </label>
                <input 
                  type="number" 
                  className="w-full bg-white/10 border-2 border-white/20 p-4 rounded-2xl outline-none text-white font-black text-lg placeholder:text-white/40 focus:border-white"
                  value={product.descuentoPorcentaje || ''}
                  onChange={(e) => handleFieldChange('descuentoPorcentaje', Number(e.target.value))}
                  placeholder="0"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* NOMBRE */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-2" style={{ color: 'var(--foreground)' }}>
                Identificación del Producto
              </label>
              <div className="relative group">
                <Edit3 className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 opacity-40 group-focus-within:opacity-100" size={18} />
                <input 
                  type="text" 
                  className="w-full rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none transition-all border-2 bg-transparent focus:border-blue-500"
                  style={{ borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}
                  value={product.name || ''}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  placeholder="Ej: MacBook Pro M3 Max"
                  required
                />
              </div>
            </div>

            {/* CATEGORÍA */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-2" style={{ color: 'var(--foreground)' }}>
                <LayoutGrid size={10} className="inline mr-1" /> Categoría
              </label>
              
              {!isAddingNew ? (
                <select 
                  className="w-full rounded-2xl py-4 px-4 text-sm font-bold outline-none border-2 bg-transparent focus:border-blue-500 cursor-pointer"
                  style={{ borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}
                  value={product.category || ''}
                  onChange={handleCategoryChange}
                  required
                >
                  <option value="" className="bg-slate-900 text-white">Seleccionar...</option>
                  {categories.map((cat: any) => (
                    <option key={cat._id} value={cat.name} className="bg-slate-900 text-white">{cat.name}</option>
                  ))}
                  <option value="NEW_CATEGORY" className="text-blue-500 font-black">+ NUEVA CATEGORÍA</option>
                </select>
              ) : (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    className="flex-1 rounded-2xl py-4 px-4 text-sm font-bold outline-none border-2 border-blue-500 bg-transparent"
                    style={{ color: 'var(--foreground)' }}
                    placeholder="Nombre..."
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    autoFocus
                  />
                  <button type="button" onClick={handleAddNewCategory} className="bg-blue-600 text-white px-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">Añadir</button>
                  <button type="button" onClick={() => setIsAddingNew(false)} className="p-4 rounded-2xl border-2" style={{ borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}><X size={18} /></button>
                </div>
              )}
            </div>

            {/* PRECIO */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-2" style={{ color: 'var(--foreground)' }}>
                Precio de Venta ($)
              </label>
              <input 
                type="number" 
                className="w-full rounded-2xl py-4 px-4 text-sm font-bold outline-none border-2 bg-transparent focus:border-blue-500"
                style={{ borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}
                value={product.price || ''}
                onChange={(e) => handleFieldChange('price', Number(e.target.value))}
                required
              />
            </div>

            {/* STOCK (CAMPO REINSTALADO) */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-2" style={{ color: 'var(--foreground)' }}>
                <Package size={10} className="inline mr-1" /> Unidades en Stock
              </label>
              <div className="relative group">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 opacity-40 group-focus-within:opacity-100" size={18} />
                <input 
                  type="number" 
                  className="w-full rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none transition-all border-2 bg-transparent focus:border-blue-500"
                  style={{ borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}
                  value={product.stock ?? ''}
                  onChange={(e) => handleFieldChange('stock', Number(e.target.value))}
                  placeholder="Cantidad disponible para vender"
                  required
                />
              </div>
            </div>
          </div>

          {/* IMÁGENES */}
          <div className="space-y-3 p-6 rounded-[2rem] border-2 border-dashed" style={{ borderColor: 'var(--border-theme)' }}>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 flex items-center gap-2">
              <ImageIcon size={14} /> Activos Visuales (URLs)
            </label>
            <div className="space-y-3">
              {[ {k: 'image', p: 'Imagen Principal'}, {k: 'image2', p: 'Vista Lateral'}, {k: 'image3', p: 'Detalle Tech'} ].map((img) => (
                <input 
                  key={img.k}
                  type="text" 
                  className="w-full rounded-xl py-3 px-4 text-xs font-bold outline-none border bg-transparent focus:border-blue-500"
                  style={{ borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}
                  value={product[img.k] || ''} 
                  onChange={(e) => handleFieldChange(img.k, e.target.value)} 
                  placeholder={img.p} 
                />
              ))}
            </div>
          </div>

          {/* DESCRIPCIÓN */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-2" style={{ color: 'var(--foreground)' }}>
              <Info size={10} className="inline mr-1" /> Especificaciones y Detalles
            </label>
            <textarea 
              className="w-full rounded-[1.5rem] py-4 px-4 text-sm font-bold outline-none border-2 bg-transparent focus:border-blue-500 h-32 resize-none"
              style={{ borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}
              value={product.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Describe las capacidades del equipo..."
            />
          </div>
        </form>

        {/* ACCIONES FINALES */}
        <div className="p-8 border-t flex gap-4 bg-transparent" style={{ borderColor: 'var(--border-theme)' }}>
          <button type="button" onClick={onClose} className="flex-1 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border-2 transition-all hover:bg-red-500/10 hover:text-red-500"
                  style={{ borderColor: 'var(--border-theme)', color: 'var(--foreground)' }}>
            Descartar
          </button>
          <button 
            type="submit" 
            onClick={handleFormSubmit}
            className="flex-1 py-5 rounded-2xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:bg-blue-500 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Save size={16} />
            {isCreating ? 'Finalizar Creación' : 'Aplicar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};