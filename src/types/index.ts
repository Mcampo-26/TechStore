export interface Product {
  _id: string;
  id?: string; // Para compatibilidad
  name: string;
  price: number;
  image: string;
  image2?: string;
  image3?: string;
  category: string;
  description: string;
  stock: number;
  isOferta?: boolean | string; // Lo recibimos a veces como string de la DB
  descuento?: number;          // <--- AGREGA ESTA LÍNEA
  descuentoPorcentaje?: number; // Por si usas este nombre también
}