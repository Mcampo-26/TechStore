"use client";

import { useState, useCallback, useMemo } from 'react';
import { useStockStore } from '@/store/useStockStore';
import { useAuthStore } from '@/store/useAuthStore';
import Swal from 'sweetalert2';

export const useStock = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const setStocks = useStockStore((state) => state.setStocks);
  
  // Obtenemos el usuario del store (normalizado como 'id' en tu useAuthStore)
  const user = useAuthStore((state) => state.user);

  // Memorizamos el Toast para evitar recrearlo innecesariamente
  const Toast = useMemo(() => Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  }), []);

  const fetchAllStock = useCallback(async () => {
    try {
      const res = await fetch('/api/stock');
      if (!res.ok) throw new Error('No se pudo obtener el inventario');
      
      const data = await res.json();
      setStocks(data);
    } catch (error) {
      console.error("Error fetching stock:", error);
      Toast.fire({ icon: 'error', title: 'Error al cargar el inventario' });
    }
  }, [setStocks, Toast]);

  const applyMovimiento = async (
    productoInput: any, // Puede ser el ID (string) o el objeto Producto completo
    cantidad: number, 
    tipo: 'entrada' | 'salida', 
    motivo: string
  ) => {
    
    // 1. EXTRAER ID DEL PRODUCTO (Evita el error [object Object])
    const productoId = typeof productoInput === 'object' 
      ? (productoInput._id || productoInput.id) 
      : productoInput;

    // 2. VALIDACIÓN DE IDENTIDAD (Debe estar logueado)
    const currentUserId = user?.id; // Usamos .id porque tu store ya lo normalizó
    
    if (!currentUserId) {
      Toast.fire({
        icon: 'warning',
        title: 'Sesión no válida',
        text: 'Debes iniciar sesión para registrar movimientos.'
      });
      return false;
    }

    if (!productoId || productoId === '[object Object]') {
      Toast.fire({ icon: 'error', title: 'ID de producto inválido' });
      return false;
    }

    setIsProcessing(true);

    try {
      const res = await fetch(`/api/stock/${productoId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cantidad, 
          tipo, 
          motivo,
          usuarioId: currentUserId // Enviamos el ID al backend
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || 'Error en la operación');
      }
      
      Toast.fire({
        icon: 'success',
        title: 'Movimiento registrado con éxito'
      });
      
      // 3. ACTUALIZACIÓN EN TIEMPO REAL: Refrescamos el store global
      await fetchAllStock(); 
      return true;

    } catch (error: any) {
      console.error("Error en applyMovimiento:", error);
      Toast.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'No se pudo registrar el movimiento'
      });
      return false;
    } finally {
      // Pequeño retraso para evitar spam de clics
      setTimeout(() => setIsProcessing(false), 600); 
    }
  };

  return { fetchAllStock, applyMovimiento, isProcessing };
};