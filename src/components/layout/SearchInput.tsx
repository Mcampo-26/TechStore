"use client";

import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const SearchInput = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { searchQuery, setSearchQuery } = useProductStore();
  
  // Estado local para que el input sea fluido y no dependa de la URL
  const [inputValue, setInputValue] = useState(searchQuery);

  // Sincronizar store y estado local si la URL cambia (ej: al limpiar filtros)
  useEffect(() => {
    const q = searchParams.get('q') || "";
    setInputValue(q);
    setSearchQuery(q);
  }, [searchParams]);

  // EFECTO DEBOUNCE: Actualiza la URL solo cuando el usuario deja de escribir
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (inputValue) {
        params.set('q', inputValue);
      } else {
        params.delete('q');
      }
      
      // Solo navegamos si el valor realmente cambió para evitar re-renders innecesarios
      if (params.get('q') !== (searchParams.get('q') || "")) {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }, 300); // 300ms de espera

    return () => clearTimeout(timeoutId);
  }, [inputValue, pathname, router]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setSearchQuery(e.target.value); // El store se actualiza rápido para la UI
  };

  const clearSearch = () => {
    setInputValue("");
    setSearchQuery("");
    const params = new URLSearchParams(searchParams);
    params.delete('q');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="relative w-full group">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search size={18} className={`${inputValue ? 'text-blue-600' : 'text-gray-400'}`} />
      </div>
      
      <input
        type="text"
        value={inputValue}
        onChange={handleSearch}
        placeholder="Buscar..."
        className="w-full bg-[var(--card-bg)] border border-[var(--border-theme)] text-[var(--foreground)] pl-12 pr-12 py-2.5 rounded-2xl text-sm focus:outline-none focus:border-blue-600 transition-all"
      />

      {inputValue && (
        <button onClick={clearSearch} className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-red-500">
          <X size={16} />
        </button>
      )}
    </div>
  );
};