import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Swal from 'sweetalert2'; // <--- Asegúrate de tener instalado sweetalert2

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
  setCart: (newCart: CartItem[]) => void;
  addToCart: (product: any, userId?: string) => Promise<void>;
  removeFromCart: (productId: string, userId?: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, userId?: string) => Promise<void>;
  clearCart: () => void;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      setCart: (newCart) => {
        set({ cart: newCart });
      },

      addToCart: async (product, userId) => {
        const currentCart = get().cart;
        const productId = product._id || product.id;
        const existing = currentCart.find((item) => item.id === productId);

        let updatedCart;
        if (existing) {
          // VALIDACIÓN: Si ya existe en el carrito
          if (existing.quantity >= (product.stock || existing.stock)) {
            // AVISO DE STOCK AGOTADO
            Swal.fire({
              title: 'Límite alcanzado',
              text: `Lo sentimos, solo quedan ${existing.stock} unidades en stock.`,
              icon: 'warning',
              confirmButtonColor: '#3483fa',
              timer: 3000
            });
            return; // Cortamos la ejecución aquí, no actualizamos nada
          }

          updatedCart = currentCart.map((item) =>
            item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          // Si es un producto nuevo, verificamos que al menos haya 1 en stock
          if (product.stock < 1) {
            Swal.fire({
              title: 'Sin stock',
              text: 'Este producto no tiene unidades disponibles.',
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
              stock: product.stock, 
            },
          ];
        }

        set({ cart: updatedCart });

        if (userId) {
          await syncWithMongo(userId, updatedCart);
        }
      },

      removeFromCart: async (productId, userId) => {
        const updatedCart = get().cart.filter((item) => item.id !== productId);
        set({ cart: updatedCart });
        if (userId) await syncWithMongo(userId, updatedCart);
      },

      updateQuantity: async (productId, quantity, userId) => {
        if (quantity < 1) return;

        const updatedCart = get().cart.map((item) => {
          if (item.id === productId) {
            // VALIDACIÓN: No permitimos que quantity supere el stock
            if (quantity > item.stock) {
              Swal.fire({
                toast: true,
                position: 'top-end',
                title: 'Stock máximo alcanzado',
                icon: 'info',
                showConfirmButton: false,
                timer: 2000
              });
              return { ...item, quantity: item.stock };
            }
            return { ...item, quantity };
          }
          return item;
        });

        set({ cart: updatedCart });

        if (userId) {
          await syncWithMongo(userId, updatedCart);
        }
      },

      clearCart: () => set({ cart: [] }),

      getTotalItems: () => {
        return get().cart.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

async function syncWithMongo(userId: string, cart: CartItem[]) {
  try {
    await fetch('/api/cart/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, cart }),
    });
  } catch (error) {
    console.error("❌ Error sincronizando:", error);
  }
}