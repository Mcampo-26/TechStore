export interface Product {
  _id: string;      // Obligatorio para MongoDB
  id?: string;      // Opcional para compatibilidad en Frontend
  name: string;
  description: string;
  price: number;
  image: string;    // Imagen principal
  // --- AGREGA ESTAS LÍNEAS AQUÍ ---
  image2?: string;  // Segunda imagen opcional
  image3?: string;  // Tercera imagen opcional
  descuentoPorcentaje?: number; // Porcentaje de oferta
  // --------------------------------
  stock: number;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
  isOferta?: boolean; 
}