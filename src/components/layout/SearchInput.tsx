"use client";

import React from 'react';
import { Search, X } from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';
import { usePathname } from 'next/navigation';

export const SearchInput = () => {
  const pathname = usePathname();
  const { searchQuery, setSearchQuery } = useProductStore();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Simplemente actualizamos el store global
    setSearchQuery(value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="relative w-full group">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search 
          size={18} 
          className={`transition-colors ${searchQuery ? 'text-blue-600' : 'text-gray-400 group-focus-within:text-blue-600'}`} 
        />
      </div>
      
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder={pathname === '/' ? "Buscar en destacados..." : "Buscar en el catálogo..."}
        className="w-full bg-[var(--card-bg)] border border-[var(--border-theme)] text-[var(--foreground)] pl-12 pr-12 py-2.5 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-gray-500 shadow-sm"
      />

      {searchQuery && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};