"use client";

import { useState } from 'react';
import { useStockStore } from '@/store/useStockStore';
import { useProductStore } from '@/store/useProductStore';
import { useLogStore } from '@/store/useLogStore';
import { useAuthStore } from '@/store/useAuthStore';
import Swal from 'sweetalert2';

export const useStock = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { updateStockFromMovement } = useStockStore();
  const { products, updateProductInList } = useProductStore();
  const addLogToTerminal = useLogStore((state) => state.addLog);
  const user = useAuthStore((state) => state.user);

  const applyMovimiento = async (productoInput: any, cantidad: number, tipo: 'entrada' | 'salida', motivo: string) => {
    const productoId = typeof productoInput === 'object' ? (productoInput._id || productoInput.id) : productoInput;
    if (!productoId) return false;

    setIsProcessing(true);
    try {
      const res = await fetch(`/api/stock/${productoId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cantidad, 
          tipo, 
          motivo, 
          usuarioNombre: user?.nombre || 'Raul' 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error en servidor');

      if (data.success) {
        // 1. Terminal
        if (data.nuevoLog) addLogToTerminal(data.nuevoLog);

        // 2. Store de Stock (usando campo stock corregido)
        updateStockFromMovement(productoId, data.nuevoTotal, data.nuevoLog);

        // 3. Store de Productos (La lista que ves en el inventario)
        const prod = products.find(p => p._id === productoId || p.id === productoId);
        if (prod) {
          updateProductInList({ ...prod, stock: data.nuevoTotal });
        }
        return true;
      }
      return false;
    } catch (error: any) {
      Swal.fire("Error", error.message, "error");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return { applyMovimiento, isProcessing };
};