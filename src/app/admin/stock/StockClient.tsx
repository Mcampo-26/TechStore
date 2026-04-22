"use client";

import React, { useState } from "react";
import { PackagePlus, ArrowUpCircle, ArrowDownCircle, Search, Save } from "lucide-react";
import { useStock } from "@/hooks/useStock";
import Swal from "sweetalert2";

export default function StockClient({ products }: { products: any[] }) {
  const { applyMovimiento, isProcessing } = useStock();
  
  // Estado del formulario
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [cantidad, setCantidad] = useState<number>(1);
  const [tipo, setTipo] = useState<'entrada' | 'salida'>('entrada');
  const [motivo, setMotivo] = useState("");

  // Filtrado de productos para el buscador
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5); // Mostramos solo 5 sugerencias

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return Swal.fire("Error", "Selecciona un producto", "error");
    if (cantidad <= 0) return Swal.fire("Error", "La cantidad debe ser mayor a 0", "error");

    const result = await Swal.fire({
      title: '¿Confirmar movimiento?',
      text: `${tipo === 'entrada' ? 'Sumar' : 'Restar'} ${cantidad} unidades a ${selectedProduct.name}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: tipo === 'entrada' ? '#10b981' : '#ef4444',
      confirmButtonText: 'Confirmar'
    });

    if (result.isConfirmed) {
      const success = await applyMovimiento(selectedProduct._id, cantidad, tipo, motivo || `Ajuste manual de ${tipo}`);
      if (success) {
        Swal.fire("Registrado", "El stock ha sido actualizado", "success");
        // Limpiar formulario
        setSelectedProduct(null);
        setSearchTerm("");
        setCantidad(1);
        setMotivo("");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tighter">Gestión de Stock <span className="text-emerald-500">.</span></h1>
        <p className="text-sm opacity-50 uppercase font-bold tracking-widest">Ingreso y Egreso de Mercadería</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900/20 border border-white/5 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-md space-y-8">
        
        {/* 1. BUSCADOR DE PRODUCTO */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">1. Buscar Producto</label>
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 opacity-20" size={20} />
            <input 
              type="text"
              className="w-full bg-white/5 border-2 border-white/5 rounded-2xl py-4 pl-14 pr-6 font-bold outline-none focus:border-blue-500 transition-all"
              placeholder="Escribe el nombre del producto..."
              value={selectedProduct ? selectedProduct.name : searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (selectedProduct) setSelectedProduct(null);
              }}
            />
          </div>

          {/* Resultados del buscador */}
          {searchTerm && !selectedProduct && (
            <div className="bg-slate-800 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {filteredProducts.map(p => (
                <button
                  key={p._id}
                  type="button"
                  onClick={() => setSelectedProduct(p)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-blue-600 transition-colors border-b border-white/5 last:border-none"
                >
                  <img src={p.image} className="w-10 h-10 object-contain bg-white rounded-lg p-1" alt="" />
                  <div className="text-left">
                    <p className="font-bold text-sm">{p.name}</p>
                    <p className="text-[10px] opacity-60 uppercase">{p.category}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 2. CANTIDAD */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">2. Cantidad</label>
            <input 
              type="number"
              min="1"
              className="w-full bg-white/5 border-2 border-white/5 rounded-2xl py-4 px-6 font-black text-2xl outline-none focus:border-blue-500 transition-all text-center"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
            />
          </div>

          {/* 3. TIPO DE MOVIMIENTO */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">3. Tipo</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setTipo('entrada')}
                className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2 ${tipo === 'entrada' ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'bg-transparent border-white/5 opacity-40'}`}
              >
                <ArrowUpCircle size={18} /> Entrada
              </button>
              <button
                type="button"
                onClick={() => setTipo('salida')}
                className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2 ${tipo === 'salida' ? 'bg-red-500 border-red-400 text-white' : 'bg-transparent border-white/5 opacity-40'}`}
              >
                <ArrowDownCircle size={18} /> Salida
              </button>
            </div>
          </div>
        </div>

        {/* 4. MOTIVO */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">4. Motivo / Nota</label>
          <input 
            type="text"
            className="w-full bg-white/5 border-2 border-white/5 rounded-2xl py-4 px-6 font-bold outline-none focus:border-blue-500 transition-all"
            placeholder="Ej: Compra a proveedor #102, Ajuste por rotura, etc."
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
        </div>

        {/* BOTÓN FINAL */}
        <button
          type="submit"
          disabled={isProcessing || !selectedProduct}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-20 disabled:grayscale py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3"
        >
          <Save size={20} />
          {isProcessing ? 'Procesando...' : 'Registrar Movimiento'}
        </button>
      </form>
    </div>
  );
}