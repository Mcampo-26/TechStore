"use client";

import React from 'react';
import { X, Save, Plus, Image as ImageIcon, Tag } from 'lucide-react';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  setProduct: (product: any) => void;
  onUpdate: (e: React.FormEvent) => void;
  isCreating?: boolean;
}

export const EditProductModal = ({ isOpen, onClose, product, setProduct, onUpdate, isCreating = false }: EditProductModalProps) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-800">
            {isCreating ? 'Crear Nuevo Producto' : 'Editar Producto'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onUpdate} className="p-6 space-y-4">
          {/* NOMBRE */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Nombre del Producto</label>
            <input 
              type="text" 
              className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-[#3483fa] outline-none transition-all"
              value={product.name || ''}
              onChange={(e) => setProduct({...product, name: e.target.value})}
              required
              placeholder="Ej: Teclado Mecánico RGB"
            />
          </div>

          {/* CATEGORÍA (Campo Agregado para solucionar el error) */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider flex items-center gap-1">
              <Tag size={10} /> Categoría
            </label>
            <select 
              className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-[#3483fa] outline-none bg-white transition-all"
              value={product.category || ''}
              onChange={(e) => setProduct({...product, category: e.target.value})}
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
                onChange={(e) => setProduct({...product, price: Number(e.target.value)})}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Stock Disponible</label>
              <input 
                type="number" 
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-[#3483fa] outline-none"
                value={product.stock || ''}
                onChange={(e) => setProduct({...product, stock: Number(e.target.value)})}
                required
              />
            </div>
          </div>

          {/* GALERÍA DE IMÁGENES */}
          <div className="bg-blue-50/50 p-4 rounded-xl space-y-3 border border-dashed border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <ImageIcon size={14} className="text-[#3483fa]" />
              <label className="block text-[10px] font-bold text-[#3483fa] uppercase tracking-wider">Galería de Imágenes (URLs)</label>
            </div>
            
            <div className="space-y-2">
              <input 
                type="text" 
                className="w-full border border-gray-200 p-2 rounded-lg text-sm outline-[#3483fa]" 
                value={product.image || ''} 
                onChange={(e) => setProduct({...product, image: e.target.value})} 
                placeholder="URL Imagen Principal (Obligatoria)" 
                required 
              />
              <input 
                type="text" 
                className="w-full border border-gray-200 p-2 rounded-lg text-sm outline-[#3483fa]" 
                value={product.image2 || ''} 
                onChange={(e) => setProduct({...product, image2: e.target.value})} 
                placeholder="URL Imagen Secundaria 1" 
              />
              <input 
                type="text" 
                className="w-full border border-gray-200 p-2 rounded-lg text-sm outline-[#3483fa]" 
                value={product.image3 || ''} 
                onChange={(e) => setProduct({...product, image3: e.target.value})} 
                placeholder="URL Imagen Secundaria 2" 
              />
            </div>
          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Descripción</label>
            <textarea 
              className="w-full border border-gray-200 p-3 rounded-lg h-28 resize-none outline-none focus:ring-2 focus:ring-[#3483fa] transition-all"
              value={product.description || ''}
              onChange={(e) => setProduct({...product, description: e.target.value})}
              placeholder="Detalles del producto..."
            ></textarea>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="flex gap-3 pt-4 sticky bottom-0 bg-white">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3 bg-[#3483fa] text-white rounded-xl font-bold hover:bg-[#2968c8] flex items-center justify-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
            >
              {isCreating ? <Plus size={18} /> : <Save size={18} />}
              {isCreating ? 'Crear Producto' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};