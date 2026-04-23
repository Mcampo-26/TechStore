"use client";

import React, { useState } from "react";
import { PackagePlus, ArrowUpCircle, ArrowDownCircle, Search, Save, Loader2 } from "lucide-react";
import { useStock } from "@/hooks/useStock";
import Swal from "sweetalert2";

export default function StockClient({ products }: { products: any[] }) {
  const { applyMovimiento, isProcessing } = useStock();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [cantidad, setCantidad] = useState<number>(1);
  const [tipo, setTipo] = useState<'entrada' | 'salida'>('entrada');
  const [motivo, setMotivo] = useState("");

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Evita interferencias con otros formularios
    console.log("--- DEBUG FRONTEND ---");
    console.log("Producto Seleccionado:", selectedProduct);
    console.log("ID a enviar:", selectedProduct?._id);
    console.log("Datos del Form:", { cantidad, tipo, motivo });
    console.log("Submit disparado"); // Debug

    if (!selectedProduct) {
      return Swal.fire("Error", "Debes seleccionar un producto de la lista desplegable", "error");
    }
    
    if (cantidad <= 0) {
      return Swal.fire("Error", "La cantidad debe ser mayor a 0", "error");
    }

    const result = await Swal.fire({
      title: '¿Confirmar movimiento?',
      text: `${tipo === 'entrada' ? 'Sumar' : 'Restar'} ${cantidad} unidades a ${selectedProduct.name}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: tipo === 'entrada' ? '#10b981' : '#ef4444',
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar',
      background: 'var(--card-bg)',
      color: 'var(--foreground)'
    });

    if (result.isConfirmed) {
      try {
        console.log("Enviando a applyMovimiento:", selectedProduct._id, cantidad, tipo);
        const success = await applyMovimiento(
          selectedProduct._id, 
          cantidad, 
          tipo, 
          motivo || `Ajuste manual de ${tipo}`
        );

        if (success) {
          await Swal.fire({
            title: "¡Éxito!",
            text: "El stock ha sido actualizado correctamente",
            icon: "success",
            background: 'var(--card-bg)',
            color: 'var(--foreground)'
          });
          
          // Resetear todo el formulario
          setSelectedProduct(null);
          setSearchTerm("");
          setCantidad(1);
          setMotivo("");
        }
      } catch (error) {
        console.error("Error en el registro:", error);
        Swal.fire("Error Fatal", "No se pudo conectar con el servidor", "error");
      }
    }
  };

  return (
    <div className="space-y-8 transition-colors duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tighter text-[var(--foreground)]">
          Gestión de Stock <span className="text-blue-600">.</span>
        </h1>
        <p className="text-sm opacity-50 uppercase font-bold tracking-widest text-[var(--foreground)]">
          Ingreso y Egreso de Mercadería
        </p>
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="bg-[var(--card-bg)] border border-[var(--border-theme)] rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-8"
      >
        
        {/* 1. BUSCADOR DE PRODUCTO */}
        <div className="space-y-4 relative">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2 text-[var(--foreground)]">
            1. Buscar Producto
          </label>
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 opacity-20 text-[var(--foreground)]" size={20} />
            <input 
              type="text"
              required
              className="w-full bg-[var(--background)] border-2 border-[var(--border-theme)] text-[var(--foreground)] rounded-2xl py-4 pl-14 pr-6 font-bold outline-none focus:border-blue-500 transition-all"
              placeholder="Escribe el nombre del producto..."
              value={selectedProduct ? selectedProduct.name : searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (selectedProduct) setSelectedProduct(null);
              }}
            />
          </div>

          {/* Resultados del buscador - Posicionado absoluto para no empujar el form */}
          {searchTerm && !selectedProduct && (
            <div className="absolute top-full left-0 w-full bg-[var(--card-bg)] border border-[var(--border-theme)] rounded-2xl overflow-hidden shadow-2xl z-50 mt-2">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(p => (
                  <button
                    key={p._id}
                    type="button"
                    onClick={() => {
                      setSelectedProduct(p);
                      setSearchTerm("");
                    }}
                    className="w-full flex items-center gap-4 p-4 hover:bg-blue-600 hover:text-white transition-colors border-b border-[var(--border-theme)] last:border-none text-[var(--foreground)]"
                  >
                    <img src={p.image} className="w-10 h-10 object-contain bg-white rounded-lg p-1" alt="" />
                    <div className="text-left">
                      <p className="font-bold text-sm">{p.name}</p>
                      <p className="text-[10px] opacity-60 uppercase">{p.category?.name || p.category}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs opacity-50">No se encontraron productos</div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 2. CANTIDAD */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2 text-[var(--foreground)]">2. Cantidad</label>
            <input 
              type="number"
              min="1"
              required
              className="w-full bg-[var(--background)] border-2 border-[var(--border-theme)] text-[var(--foreground)] rounded-2xl py-4 px-6 font-black text-2xl outline-none focus:border-blue-500 transition-all text-center"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
            />
          </div>

          {/* 3. TIPO DE MOVIMIENTO */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2 text-[var(--foreground)]">3. Tipo</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setTipo('entrada')}
                className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2 ${
                  tipo === 'entrada' 
                  ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20' 
                  : 'bg-[var(--background)] border-[var(--border-theme)] opacity-40 text-[var(--foreground)]'
                }`}
              >
                <ArrowUpCircle size={18} /> Entrada
              </button>
              <button
                type="button"
                onClick={() => setTipo('salida')}
                className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2 ${
                  tipo === 'salida' 
                  ? 'bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/20' 
                  : 'bg-[var(--background)] border-[var(--border-theme)] opacity-40 text-[var(--foreground)]'
                }`}
              >
                <ArrowDownCircle size={18} /> Salida
              </button>
            </div>
          </div>
        </div>

        {/* 4. MOTIVO */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2 text-[var(--foreground)]">4. Motivo / Nota</label>
          <input 
            type="text"
            className="w-full bg-[var(--background)] border-2 border-[var(--border-theme)] text-[var(--foreground)] rounded-2xl py-4 px-6 font-bold outline-none focus:border-blue-500 transition-all"
            placeholder="Ej: Compra a proveedor, Ajuste por rotura..."
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
        </div>

        {/* BOTÓN FINAL */}
        <button
          type="submit"
          disabled={isProcessing || !selectedProduct}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-500 disabled:opacity-30 disabled:cursor-not-allowed py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Procesando...
            </>
          ) : (
            <>
              <Save size={20} />
              Registrar Movimiento
            </>
          )}
        </button>
      </form>
    </div>
  );
}