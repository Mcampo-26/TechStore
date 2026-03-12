"use client";

import React, { useEffect } from 'react';
import { X, Save, Plus, Image as ImageIcon, Tag, Zap, Percent, Edit3 } from 'lucide-react';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  setProduct: (product: any) => void;
  onUpdate: (e: React.FormEvent) => void;
  isCreating?: boolean;
}

export const EditProductModal = ({ isOpen, onClose, product, setProduct, onUpdate, isCreating = false }: EditProductModalProps) => {
  
  // LOG: Monitorear cuando el producto cambia o el modal se abre
  useEffect(() => {
    if (isOpen) {
      console.log("📂 [MODAL] Abierto con producto:", product);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  // Función auxiliar para logs de cambios
  const handleFieldChange = (field: string, value: any) => {
    console.log(`✍️ [MODAL] Editando campo: ${field} ->`, value);
    setProduct({ ...product, [field]: value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    console.log("💾 [MODAL] Click en GUARDAR. Objeto final enviado:", product);
    onUpdate(e);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        
        {/* HEADER */}
        <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {isCreating ? <Plus className="text-[#3483fa]" /> : <Edit3 className="text-[#3483fa]" size={20} />}
            {isCreating ? 'Crear Nuevo Producto' : 'Editar Producto'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
          
          {/* SECCIÓN: OFERTA RELÁMPAGO */}
          <div className={`p-4 rounded-xl border-2 transition-all ${product.isOferta ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-transparent'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${product.isOferta ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                  <Zap size={18} fill={product.isOferta ? "currentColor" : "none"} />
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${product.isOferta ? 'text-blue-700' : 'text-gray-500'}`}>Oferta Relámpago</h3>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Destacar en la tienda</p>
                </div>
              </div>
              
              <button 
                type="button"
                onClick={() => handleFieldChange('isOferta', !product.isOferta)}
                className={`w-12 h-6 rounded-full relative transition-colors ${product.isOferta ? 'bg-blue-500' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${product.isOferta ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            {product.isOferta && (
              <div className="mt-4 pt-4 border-t border-blue-100 animate-in fade-in slide-in-from-top-2">
                <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1 tracking-wider flex items-center gap-1">
                  <Percent size={10} /> Porcentaje de Descuento
                </label>
                <input 
                  type="number" 
                  className="w-full border border-blue-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-sm font-bold text-blue-700"
                  value={product.descuentoPorcentaje || ''}
                  onChange={(e) => handleFieldChange('descuentoPorcentaje', Number(e.target.value))}
                  placeholder="Ej: 40"
                  min="0"
                  max="100"
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* NOMBRE */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Nombre del Producto</label>
              <input 
                type="text" 
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-[#3483fa] outline-none"
                value={product.name || ''}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                required
              />
            </div>

            {/* CATEGORÍA */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider flex items-center gap-1">
                <Tag size={10} /> Categoría
              </label>
              <select 
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-[#3483fa] outline-none"
                value={product.category || ''}
                onChange={(e) => handleFieldChange('category', e.target.value)}
                required
              >
                <option value="">Selecciona una categoría...</option>
                <option value="Notebooks">Notebooks</option>
                <option value="Celulares">Celulares</option>
                <option value="Componentes">Componentes</option>
                <option value="Periféricos">Periféricos</option>
                <option value="Monitores">Monitores</option>
              </select>
            </div>

            {/* PRECIO Y STOCK */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Precio ($)</label>
                <input 
                  type="number" 
                  className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-[#3483fa] outline-none"
                  value={product.price || ''}
                  onChange={(e) => handleFieldChange('price', Number(e.target.value))}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Stock Disponible</label>
                <input 
                  type="number" 
                  className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-[#3483fa] outline-none"
                  value={product.stock || ''}
                  onChange={(e) => handleFieldChange('stock', Number(e.target.value))}
                  required
                />
              </div>
            </div>

            {/* IMÁGENES */}
            <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-200">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Galería de Imágenes (URLs)</label>
              <input 
                type="text" 
                className="w-full border border-gray-200 p-2 rounded-lg text-sm" 
                value={product.image || ''} 
                onChange={(e) => handleFieldChange('image', e.target.value)} 
                placeholder="Imagen 1 (Principal)" 
                required 
              />
              <input 
                type="text" 
                className="w-full border border-gray-200 p-2 rounded-lg text-sm" 
                value={product.image2 || ''} 
                onChange={(e) => handleFieldChange('image2', e.target.value)} 
                placeholder="Imagen 2" 
              />
              <input 
                type="text" 
                className="w-full border border-gray-200 p-2 rounded-lg text-sm" 
                value={product.image3 || ''} 
                onChange={(e) => handleFieldChange('image3', e.target.value)} 
                placeholder="Imagen 3" 
              />
            </div>

            {/* DESCRIPCIÓN */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Descripción</label>
              <textarea 
                className="w-full border border-gray-200 p-3 rounded-lg h-28 resize-none outline-none focus:ring-2 focus:ring-[#3483fa]"
                value={product.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
              ></textarea>
            </div>
          </div>

          {/* BOTONES */}
          <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white pb-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-500">
              Cancelar
            </button>
            <button type="submit" className="flex-1 py-3 bg-[#3483fa] text-white rounded-xl font-bold shadow-lg shadow-blue-100">
              {isCreating ? 'Crear Producto' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};