"use client";

import { useState, useCallback } from 'react';
import { useStockStore } from '@/store/useStockStore';
import { useProductStore } from '@/store/useProductStore';
import { useLogStore } from '@/store/useLogStore';
import { useAuthStore } from '@/store/useAuthStore';
import Swal from 'sweetalert2';

/**
 * Hook refactorizado para la gestión de movimientos de inventario.
 * Sincroniza automáticamente los lotes (StockStore), el stock global (ProductStore)
 * y el historial de actividad (LogStore).
 */
export const useStock = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Acceso a los stores
  const { stocks, setStocks, updateStockFromMovement } = useStockStore();
  const { products, updateProductInList } = useProductStore();
  const addLogToTerminal = useLogStore((state) => state.addLog);
  const user = useAuthStore((state) => state.user);

  /**
   * Aplica un movimiento de entrada o salida, actualizando lotes y stock general.
   */
  const applyMovimiento = useCallback(async (
    productoInput: any, 
    cantidad: number, 
    tipo: 'entrada' | 'salida', 
    motivo: string,
    extra?: { 
      costo?: number; 
      vencimiento?: string; 
      codigo?: string 
    }
  ) => {
    // Normalización del ID del producto
    const productoId = typeof productoInput === 'object' 
      ? (productoInput._id || productoInput.id) 
      : productoInput;

    if (!productoId) {
      console.error("Error: No se proporcionó un ID de producto válido.");
      return false;
    }

    setIsProcessing(true);

    try {
      const response = await fetch(`/api/stock/${productoId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cantidad: Number(cantidad), 
          tipo, 
          motivo, 
          costo: extra?.costo || 0,
          vencimiento: extra?.vencimiento || null, // Sincronizado con el controlador POST
          codigo: extra?.codigo || `L-${Date.now().toString().slice(-6)}`, 
          usuarioNombre: user?.nombre || 'Admin' 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el movimiento de stock');
      }

      if (data.success) {
        const { nuevoTotal, stockData, nuevoLog } = data;

        // --- 1. ACTUALIZAR HISTORIAL (LOGS) ---
        if (nuevoLog) {
          addLogToTerminal(nuevoLog);
        }

        // --- 2. ACTUALIZAR LOTES Y TRAZABILIDAD (StockStore) ---
        // Buscamos si el registro de stock ya existe en el estado local
        const stockExistente = stocks.find(s => 
          s._id === stockData._id || s.producto?._id === productoId
        );

        if (stockExistente) {
          // Si existe, actualizamos el objeto completo (incluyendo el nuevo array de lotes)
          const updatedStocks = stocks.map(s => 
            (s._id === stockData._id || s.producto?._id === productoId)
              ? { ...stockData, stock: nuevoTotal } // Normalizamos totalQuantity -> stock
              : s
          );
          setStocks(updatedStocks);
        } else {
          // Si es un producto nuevo en la tabla de stock, lo agregamos
          setStocks([...stocks, { ...stockData, stock: nuevoTotal }]);
        }

        // --- 3. ACTUALIZAR MODELO PRODUCTO (ProductStore) ---
        // Esto asegura que la lista general de productos también refleje el nuevo stock
        const productInStore = products.find(p => p._id === productoId || p.id === productoId);
        if (productInStore) {
          updateProductInList({ ...productInStore, stock: nuevoTotal });
        }

        // --- 4. FEEDBACK AL USUARIO ---
        Swal.fire({
          title: '¡Éxito!',
          text: `Movimiento registrado. Nuevo stock: ${nuevoTotal}`,
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });

        return true;
      }
      
      return false;

    } catch (error: any) {
      console.error("Error en useStock:", error);
      Swal.fire({
        title: "Error de Inventario",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#3b82f6"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [user, stocks, setStocks, products, updateProductInList, addLogToTerminal]);

  return { 
    applyMovimiento, 
    isProcessing 
  };
};