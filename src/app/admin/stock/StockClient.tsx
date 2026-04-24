"use client";

import React, { useState } from "react";
import { PackagePlus, ArrowUpCircle, ArrowDownCircle, Search, Save, Loader2 } from "lucide-react";
import { useStock } from "@/hooks/useStock";
import Swal from "sweetalert2";

export default function StockClient({ products }: { products: any[] }) {
  const { applyMovimiento, isProcessing } = useStock();
  
  // ESTADOS
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [cantidad, setCantidad] = useState<number>(1);
  const [tipo, setTipo] = useState<'entrada' | 'salida'>('entrada');
  const [motivo, setMotivo] = useState("");
  const [costo, setCosto] = useState<number>(0);
  const [vencimiento, setVencimiento] = useState<string>("");
  const [codigoLote, setCodigoLote] = useState<string>("");

  // FILTRADO CORREGIDO: Busca en la estructura anidada o plana
  const filteredProducts = products.filter(p => {
    const nombre = p.producto?.name || p.name || "";
    const busqueda = searchTerm.toLowerCase();
    return nombre.toLowerCase().includes(busqueda);
  }).slice(0, 5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      return Swal.fire("Error", "Debes seleccionar un producto de la lista", "error");
    }
  
    if (tipo === 'entrada' && !codigoLote) {
      return Swal.fire("Atención", "Para una correcta trazabilidad, ingresa el número de lote", "warning");
    }
  
    // El nombre para el Swal también debe ser flexible
    const displayName = selectedProduct.producto?.name || selectedProduct.name;

    const result = await Swal.fire({
      title: '¿Confirmar movimiento?',
      text: `${tipo === 'entrada' ? 'Ingresar' : 'Egresar'} ${cantidad} unidades de ${displayName}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar',
      background: 'var(--card-bg)',
      color: 'var(--foreground)',
      confirmButtonColor: tipo === 'entrada' ? '#10b981' : '#ef4444',
    });
  
    if (result.isConfirmed) {
      try {
        // Usamos p.producto?._id si viene de la colección Stock, o p._id si es Producto directo
        const targetId = selectedProduct.producto?._id || selectedProduct._id;

        const success = await applyMovimiento(
          targetId, 
          cantidad, 
          tipo, 
          motivo || `${tipo === 'entrada' ? 'Ingreso' : 'Salida'} manual`,
          { 
            costo, 
            vencimiento, 
            codigo: tipo === 'entrada' ? codigoLote : undefined 
          } 
        );
  
        if (success) {
          await Swal.fire({
            title: "¡Éxito!",
            text: "Stock y trazabilidad actualizados correctamente",
            icon: "success",
            background: 'var(--card-bg)',
            color: 'var(--foreground)'
          });
          
          // Reset completo
          setSelectedProduct(null);
          setSearchTerm("");
          setCantidad(1);
          setMotivo("");
          setCosto(0);
          setVencimiento("");
          setCodigoLote("");
        }
      } catch (error) {
        Swal.fire("Error", "Hubo un problema al procesar el movimiento", "error");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tighter">
          Gestión de Stock <span className="text-blue-600">.</span>
        </h1>
        <p className="text-sm opacity-50 uppercase font-bold tracking-widest">
          Ingreso y Egreso de Mercadería
        </p>
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="bg-[var(--card-bg)] border border-[var(--border-theme)] rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-8"
      >
        {/* 1. BUSCADOR */}
        <div className="space-y-4 relative">
          <label className="text-[10px] font-black uppercase opacity-40">1. Buscar Producto</label>
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity" size={20} />
            <input 
              type="text"
              className="w-full bg-[var(--background)] border-2 border-[var(--border-theme)] rounded-2xl py-4 pl-14 pr-6 font-bold outline-none focus:border-blue-500 transition-all"
              placeholder="Escribe el nombre del producto..."
              value={selectedProduct ? (selectedProduct.producto?.name || selectedProduct.name) : searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (selectedProduct) setSelectedProduct(null);
              }}
            />
          </div>

          {searchTerm && !selectedProduct && (
            <div className="absolute top-full left-0 w-full bg-[var(--card-bg)] border border-[var(--border-theme)] rounded-2xl shadow-2xl z-50 overflow-hidden mt-2">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(p => (
                  <button
                    key={p._id}
                    type="button"
                    onClick={() => { 
                      setSelectedProduct(p); 
                      setSearchTerm(""); 
                    }}
                    className="w-full text-left p-5 hover:bg-blue-600 hover:text-white border-b border-[var(--border-theme)] last:border-none transition-colors group"
                  >
                    <p className="font-bold">{p.producto?.name || p.name}</p>
                    <p className="text-[10px] opacity-50 group-hover:text-white/70">ID: {p.producto?._id || p._id}</p>
                  </button>
                ))
              ) : (
                <div className="p-5 text-center opacity-40 text-xs font-bold uppercase">No se encontraron productos</div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 2. CANTIDAD */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase opacity-40">2. Cantidad</label>
            <input 
              type="number"
              min="1"
              className="w-full bg-[var(--background)] border-2 border-[var(--border-theme)] rounded-2xl py-4 px-6 font-black text-center text-2xl"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
            />
          </div>

          {/* 3. TIPO */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase opacity-40">3. Tipo de Movimiento</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setTipo('entrada')}
                className={`py-4 rounded-2xl font-black text-xs uppercase border-2 transition-all flex items-center justify-center gap-2 ${tipo === 'entrada' ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg scale-[1.02]' : 'bg-[var(--background)] border-transparent opacity-40 hover:opacity-60'}`}
              >
                <ArrowUpCircle size={18} /> Entrada
              </button>
              <button
                type="button"
                onClick={() => setTipo('salida')}
                className={`py-4 rounded-2xl font-black text-xs uppercase border-2 transition-all flex items-center justify-center gap-2 ${tipo === 'salida' ? 'bg-red-500 border-red-400 text-white shadow-lg scale-[1.02]' : 'bg-[var(--background)] border-transparent opacity-40 hover:opacity-60'}`}
              >
                <ArrowDownCircle size={18} /> Salida
              </button>
            </div>
          </div>
        </div>

        {/* 4. SECCIÓN DE LOTES (SÓLO ENTRADA) */}
        {tipo === 'entrada' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-300 p-6 bg-blue-50/5 rounded-3xl border border-blue-500/10">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">N° de Lote</label>
              <input 
                type="text"
                className="w-full bg-[var(--background)] border-2 border-[var(--border-theme)] rounded-2xl py-4 px-6 font-bold outline-none focus:border-blue-500 transition-all"
                placeholder="Ej: LOT-2024-X"
                value={codigoLote}
                onChange={(e) => setCodigoLote(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Costo Unitario ($)</label>
              <input 
                type="number"
                step="0.01"
                className="w-full bg-[var(--background)] border-2 border-[var(--border-theme)] rounded-2xl py-4 px-6 font-bold outline-none focus:border-blue-500 transition-all"
                placeholder="0.00"
                value={costo}
                onChange={(e) => setCosto(Number(e.target.value))}
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Vencimiento</label>
              <input 
                type="date"
                className="w-full bg-[var(--background)] border-2 border-[var(--border-theme)] rounded-2xl py-4 px-6 font-bold outline-none focus:border-blue-500 transition-all"
                value={vencimiento}
                onChange={(e) => setVencimiento(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* 5. MOTIVO */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase opacity-40">Motivo / Observaciones</label>
          <input 
            type="text"
            className="w-full bg-[var(--background)] border-2 border-[var(--border-theme)] rounded-2xl py-4 px-6 font-bold outline-none focus:border-blue-500 transition-all"
            placeholder="Ej: Reposición de stock por compra..."
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isProcessing || !selectedProduct}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3"
        >
          {isProcessing ? (
            <><Loader2 className="animate-spin" /> Procesando...</>
          ) : (
            <><Save size={20} /> Registrar Movimiento</>
          )}
        </button>
      </form>
    </div>
  );
}