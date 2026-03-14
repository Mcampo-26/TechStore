"use client";

import React, { useEffect, useState } from "react";
import { X, Save, PlusCircle, Edit3, Zap } from "lucide-react";
import { useCategoryStore } from "@/store/useCategoryStore";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  setProduct: (product: any) => void;
  onUpdate: (e: React.FormEvent) => void;
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
  const { categories, fetchCategories, addCategory } = useCategoryStore();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      setIsAddingNew(false);
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    }
  }, [isOpen, fetchCategories]);

  if (!isOpen || !product) return null;

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
    const savedCategory = await addCategory(newCatName);
    if (savedCategory) {
      setProduct({ ...product, category: savedCategory.name });
      setIsAddingNew(false);
      setNewCatName("");
    }
  };

  const theme = {
    modalBg: isDarkMode ? "#111827" : "#ffffff",
    inputBg: isDarkMode ? "#1f2937" : "#f8fafc",
    textColor: isDarkMode ? "#ffffff" : "#0f172a",
    labelColor: isDarkMode ? "#94a3b8" : "#64748b",
    borderColor: isDarkMode ? "#374151" : "#e2e8f0",
  };

  // SOLUCIÓN AL ERROR: Separamos 'border' en sus propiedades individuales
  const inputStyle = {
    backgroundColor: theme.inputBg,
    color: theme.textColor,
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: theme.borderColor,
    borderRadius: '16px',
    padding: '14px 18px',
    width: '100%',
    fontWeight: '600',
    outline: 'none',
    transition: 'all 0.2s'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        style={{ 
          backgroundColor: theme.modalBg, 
          borderWidth: '1px', 
          borderStyle: 'solid', 
          borderColor: theme.borderColor 
        }}
        className="w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col rounded-[2.5rem] shadow-2xl"
      >
        <div className={`p-8 border-b flex justify-between items-center ${isDarkMode ? 'bg-gray-900/50' : 'bg-slate-50'}`} 
             style={{ borderColor: theme.borderColor }}>
          <div className="flex items-center gap-4">
            <div className="bg-[#3483fa] p-3 rounded-2xl text-white shadow-lg shadow-blue-500/20">
              {isCreating ? <PlusCircle size={26} /> : <Edit3 size={26} />}
            </div>
            <div>
              <h2 style={{ color: theme.textColor }} className="text-xl font-black uppercase tracking-tight">
                {isCreating ? "Nuevo Producto" : "Editar Producto"}
              </h2>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Gestión TechStore</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={30} />
          </button>
        </div>

        <form className="flex-1 overflow-y-auto p-8 space-y-8" onSubmit={(e) => e.preventDefault()}>
          <div className={`p-6 rounded-3xl border-2 transition-all ${product.isOferta ? 'bg-blue-600 border-blue-400' : isDarkMode ? 'bg-gray-800/40 border-gray-700' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap size={22} className={product.isOferta ? 'text-white' : 'text-blue-500'} fill={product.isOferta ? "white" : "none"} />
                <span className={`font-black uppercase text-xs tracking-wider ${product.isOferta ? 'text-white' : isDarkMode ? 'text-gray-200' : 'text-slate-700'}`}>
                  Oferta Activa
                </span>
              </div>
              <button 
                type="button"
                onClick={() => setProduct({ ...product, isOferta: !product.isOferta })}
                className={`w-14 h-7 rounded-full relative transition-all ${product.isOferta ? 'bg-white' : 'bg-gray-400'}`}
              >
                <div className={`absolute top-1 w-5 h-5 rounded-full transition-all ${product.isOferta ? 'left-8 bg-blue-600' : 'left-1 bg-white'}`} />
              </button>
            </div>
            {product.isOferta && (
              <div className="mt-6 pt-6 border-t border-white/20">
                <label className="text-[10px] font-black text-white uppercase mb-2 block tracking-widest">Descuento (%)</label>
                <input 
                  type="number" 
                  style={{
                    ...inputStyle, 
                    backgroundColor: 'rgba(255,255,255,0.1)', 
                    color: '#fff', 
                    borderColor: 'rgba(255,255,255,0.2)'
                  }} 
                  value={product.descuentoPorcentaje || ""}
                  onChange={(e) => setProduct({ ...product, descuentoPorcentaje: Number(e.target.value) })}
                />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <label style={{ color: theme.labelColor }} className="text-[10px] font-black uppercase mb-2 block ml-2 tracking-widest">Nombre del Producto</label>
              <input type="text" style={inputStyle} value={product.name || ""} onChange={(e) => setProduct({ ...product, name: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label style={{ color: theme.labelColor }} className="text-[10px] font-black uppercase mb-2 block ml-2 tracking-widest">Categoría</label>
                {!isAddingNew ? (
                  <select style={inputStyle} value={product.category || ""} onChange={handleCategoryChange}>
                    <option value="" style={{color: '#000'}}>Seleccionar...</option>
                    {categories.map((cat: any) => (
                      <option key={cat._id} value={cat.name} style={{color: '#000'}}>{cat.name}</option>
                    ))}
                    <option value="NEW_CATEGORY" style={{color: '#3483fa', fontWeight: 'bold'}}>+ Crear Nueva</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input type="text" style={{...inputStyle, borderColor: '#3483fa'}} value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="Nueva..." />
                    <button type="button" onClick={handleAddNewCategory} className="bg-blue-600 text-white px-5 rounded-2xl font-bold">OK</button>
                  </div>
                )}
              </div>
              <div>
                <label style={{ color: theme.labelColor }} className="text-[10px] font-black uppercase mb-2 block ml-2 tracking-widest">Precio ($)</label>
                <input type="number" style={inputStyle} value={product.price || ""} onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })} />
              </div>
            </div>

            <div>
              <label style={{ color: theme.labelColor }} className="text-[10px] font-black uppercase mb-2 block ml-2 tracking-widest">Stock</label>
              <input type="number" style={inputStyle} value={product.stock ?? ""} onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })} />
            </div>

            <div>
              <label style={{ color: theme.labelColor }} className="text-[10px] font-black uppercase mb-2 block ml-2 tracking-widest">Descripción</label>
              <textarea style={{...inputStyle, height: '120px', resize: 'none'}} value={product.description || ""} onChange={(e) => setProduct({ ...product, description: e.target.value })} />
            </div>
          </div>
        </form>

        <div className={`p-8 border-t flex gap-4 ${isDarkMode ? 'bg-gray-900/50' : 'bg-slate-50'}`} 
             style={{ borderColor: theme.borderColor }}>
          <button 
            type="button" 
            onClick={onClose}
            className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'}`}
          >
            Cancelar
          </button>
          <button 
            onClick={onUpdate}
            className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-[#3483fa] text-white shadow-xl shadow-blue-500/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
          >
            <Save size={18} />
            {isCreating ? "Guardar" : "Actualizar"}
          </button>
        </div>
      </div>
    </div>
  );
};