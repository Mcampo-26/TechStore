import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Swal from 'sweetalert2';
import { useProductStore } from './useProductStore';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartState {
  cart: CartItem[];
  // Agregamos setCart para que no falle la llamada desde otros componentes
  setCart: (cart: CartItem[]) => void;
  addToCart: (product: any, userId?: string) => Promise<void>;
  removeFromCart: (productId: string, userId?: string) => Promise<void>;
  updateQuantity: (productId: string, newQuantity: number, userId?: string) => Promise<void>;
  clearCart: (userId?: string) => Promise<void>;
  revalidateCartStock: () => void;
}

// Función auxiliar para sincronizar con la API de MongoDB
const syncWithMongo = async (userId: string, cart: CartItem[]) => {
  try {
    await fetch('/api/cart/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, cart }),
    });
  } catch (error) {
    console.error("Error sincronizando carrito:", error);
  }
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      // Implementación de setCart para actualizar el carrito de golpe
      setCart: (cart) => set({ cart }),

      addToCart: async (product, userId) => {
        const currentCart = get().cart;
        const productId = product._id || product.id;
        const existing = currentCart.find((item) => item.id === productId);
        
        // Priorizar stock real del servidor si viene en el objeto product
        const realStock = typeof product.stock !== 'undefined' ? product.stock : (existing?.stock || 0);

        let updatedCart;

        if (existing) {
          if (existing.quantity + 1 > realStock) {
            Swal.fire({
              title: 'Límite alcanzado',
              text: `Lo sentimos, solo quedan ${realStock} unidades disponibles.`,
              icon: 'warning',
              confirmButtonColor: '#3483fa',
              timer: 3000
            });
            return;
          }
          updatedCart = currentCart.map((item) =>
            item.id === productId ? { ...item, quantity: item.quantity + 1, stock: realStock } : item
          );
        } else {
          if (realStock < 1) {
            Swal.fire({
              title: 'Sin stock',
              text: 'Producto no disponible.',
              icon: 'error',
              confirmButtonColor: '#3483fa'
            });
            return;
          }
          updatedCart = [
            ...currentCart,
            {
              id: productId,
              name: product.name,
              price: product.price,
              image: product.image,
              quantity: 1,
              stock: realStock,
            },
          ];
        }

        set({ cart: updatedCart });
        if (userId) await syncWithMongo(userId, updatedCart);
      },

      removeFromCart: async (productId, userId) => {
        const updatedCart = get().cart.filter((item) => item.id !== productId);
        set({ cart: updatedCart });
        if (userId) await syncWithMongo(userId, updatedCart);
      },

      updateQuantity: async (productId, newQuantity, userId) => {
        const updatedCart = get().cart.map((item) => {
          if (item.id === productId) {
            const validatedQty = Math.max(1, Math.min(newQuantity, item.stock));
            return { ...item, quantity: validatedQty };
          }
          return item;
        });
        set({ cart: updatedCart });
        if (userId) await syncWithMongo(userId, updatedCart);
      },

      clearCart: async (userId) => {
        set({ cart: [] });
        if (userId) await syncWithMongo(userId, []);
      },

      revalidateCartStock: () => {
        const productsFromStore = useProductStore.getState().products;
        const currentCart = get().cart;

        if (productsFromStore.length === 0 || currentCart.length === 0) return;

        const validatedCart = currentCart.map((item) => {
          const freshProduct = productsFromStore.find((p) => (p._id || p.id) === item.id);
          if (freshProduct) {
            const validatedQuantity = Math.min(item.quantity, freshProduct.stock);
            return { 
              ...item, 
              quantity: validatedQuantity, 
              stock: freshProduct.stock 
            };
          }
          return item;
        });

        const hasChanges = JSON.stringify(validatedCart) !== JSON.stringify(currentCart);
        if (hasChanges) {
          set({ cart: validatedCart });
          console.log("🛠️ Carrito revalidado con el stock actual.");
        }
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);