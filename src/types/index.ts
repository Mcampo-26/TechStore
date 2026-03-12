export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;      // Foto 1
    image2?: string;     // Foto 2 (opcional)
    image3?: string;     // Foto 3 (opcional)
    category: string;
    stock: number;
    
}