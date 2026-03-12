export interface Product {
    _id: string;      // Obligatorio para MongoDB
    id?: string;     // Opcional para compatibilidad en Frontend
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
    category?: string;
    createdAt?: string;
    updatedAt?: string;
  }