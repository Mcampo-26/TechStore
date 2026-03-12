"use client";

import React, { useState, useEffect } from 'react';

interface ProductGalleryProps {
  images: string[];
}

export const ProductGallery = ({ images }: ProductGalleryProps) => {
  // Filtramos por si vienen strings vacíos o nulos
  const validImages = images.filter(img => img && img.trim() !== "");
  
  // Estado para la imagen que se muestra en grande
  const [selectedImage, setSelectedImage] = useState(validImages[0]);

  // Si las imágenes cambian (por ejemplo, al navegar entre productos), reseteamos la seleccionada
  useEffect(() => {
    setSelectedImage(validImages[0]);
  }, [images]);

  if (validImages.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-xl flex items-center justify-center">
        <p className="text-gray-400 italic">No hay imágenes disponibles</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      
      {/* COLUMNA DE MINIATURAS (Lateral en PC, Horizontal en Móvil) */}
      <div className="order-2 md:order-1 flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto py-2 md:py-0 scrollbar-hide">
        {validImages.map((img, index) => (
          <button
            key={index}
            onMouseEnter={() => setSelectedImage(img)} // Cambia al pasar el mouse (Estilo ML)
            onClick={() => setSelectedImage(img)}      // Cambia al hacer click (Para móviles)
            className={`
              w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-md border-2 transition-all duration-200 bg-white p-1
              ${selectedImage === img 
                ? 'border-[#3483fa] shadow-sm' 
                : 'border-gray-200 hover:border-blue-300'
              }
            `}
          >
            <img 
              src={img} 
              alt={`Miniatura ${index + 1}`} 
              className="w-full h-full object-contain"
            />
          </button>
        ))}
      </div>

      {/* CONTENEDOR IMAGEN PRINCIPAL */}
      <div className="order-1 md:order-2 flex-grow bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-center min-h-[350px] md:min-h-[550px] relative">
        <img 
          src={selectedImage} 
          alt="Vista principal del producto" 
          className="max-w-full max-h-[500px] object-contain transition-opacity duration-300 ease-in-out"
        />
        
        {/* Badge opcional de "Nuevo" o "Favorito" si quisieras */}
        <div className="absolute top-4 left-4">
           <span className="bg-[#3483fa] text-white text-[10px] font-bold px-2 py-1 rounded uppercase">
             Original
           </span>
        </div>
      </div>

    </div>
  );
};