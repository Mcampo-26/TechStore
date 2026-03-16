export interface Product {
  _id: string;
  id?: string; 
  name: string;
  price: number;
  image: string;
  image2?: string;
  image3?: string;
  category: string;
  description: string;
  stock: number;
  isOferta?: boolean; 
  descuento?: number;          
  descuentoPorcentaje?: number; 
}