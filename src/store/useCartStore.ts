import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Swal from 'sweetalert2';

export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartState {
  cart: CartItem[];
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  setCart: (newCart: CartItem[]) => void;
  clearCart: () => void;
  addToCart: (product: any, userId?: string) => Promise<void>;
  removeFromCart: (productId: string, userId?: string) => Promise<void>;
  updateQuantity: (productId: string, newQuantity: number, userId?: string) => Promise<void>;
  revalidateCartStock: (allProducts?: any[]) => void;
  syncWithDB: (userId: string, cart: CartItem[]) => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      isDrawerOpen: false,

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      setCart: (newCart) => set({ cart: newCart }),
      clearCart: () => set({ cart: [] }),

      // 1. SINCRONIZACIÓN CON MONGODB
      syncWithDB: async (userId, cart) => {
        if (!userId) return;
        try {
          await fetch("/api/cart/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, cart }),
          });
        } catch (error) {
          console.error("Error sincronizando carrito con DB:", error);
        }
      },

      // 2. REVALIDACIÓN DE STOCK (Crucial para el CarritoPage)
      revalidateCartStock: (allProducts) => {
        if (!allProducts || allProducts.length === 0) return;
        
        const currentCart = get().cart;
        const updatedCart = currentCart.map(item => {
          // Buscamos el producto fresco que viene del servidor
          const fresh = allProducts.find(p => (p._id || p.id) === item.id);
          
          if (fresh) {
            const freshStock = Number(fresh.stock);
            // Si el stock actual es menor a lo que el usuario quiere comprar, lo bajamos al máximo disponible
            const adjustedQuantity = item.quantity > freshStock ? freshStock : item.quantity;
            
            return { 
              ...item, 
              price: Number(fresh.price), // Actualizamos precio por si cambió
              stock: freshStock,
              quantity: adjustedQuantity > 0 ? adjustedQuantity : 1
            };
          }
          return item;
        });

        set({ cart: updatedCart });
      },

      // 3. AGREGAR AL CARRITO
      addToCart: async (product, userId) => {
        const productId = product._id || product.id;
        const currentCart = get().cart;
        const existing = currentCart.find((item) => item.id === productId);
        const availableStock = Number(product.stock);

        // Si ya no hay stock disponible
        if (existing && existing.quantity >= availableStock) {
          set({ isDrawerOpen: false });
          Swal.fire({
            title: '¡LÍMITE DE STOCK!',
            text: `Solo quedan ${availableStock} unidades disponibles.`,
            icon: 'warning',
            confirmButtonText: 'ENTENDIDO',
            buttonsStyling: false,
            customClass: {
              popup: 'rounded-[2.5rem] border-4 border-blue-600',
              confirmButton: 'px-12 py-5 bg-blue-600 text-white font-black rounded-2xl'
            }
          });
          return;
        }

        let updatedCart: CartItem[];
        if (existing) {
          updatedCart = currentCart.map((item) =>
            item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          updatedCart = [...currentCart, {
            id: productId,
            name: product.name,
            description: product.description || "",
            price: Number(product.price),
            image: product.image,
            quantity: 1,
            stock: availableStock,
          }];
        }

        set({ cart: updatedCart, isDrawerOpen: true });
        if (userId) get().syncWithDB(userId, updatedCart);
      },

      // 4. QUITAR DEL CARRITO
      removeFromCart: async (productId, userId) => {
        const updatedCart = get().cart.filter((item) => item.id !== productId);
        set({ cart: updatedCart });
        if (userId) get().syncWithDB(userId, updatedCart);
      },

      // 5. ACTUALIZAR CANTIDAD (+ o -)
      updateQuantity: async (productId, newQuantity, userId) => {
        const currentCart = get().cart;
        const item = currentCart.find(i => i.id === productId);

        if (!item) return;

        // Si intenta subir más del stock, lo frenamos en el stock máximo
        const validatedQuantity = newQuantity > item.stock ? item.stock : Math.max(1, newQuantity);

        const updatedCart = currentCart.map((it) =>
          it.id === productId ? { ...it, quantity: validatedQuantity } : it
        );

        set({ cart: updatedCart });
        if (userId) get().syncWithDB(userId, updatedCart);
      },
    }),
    {
      name: 'cart-storage',
      // Solo persistimos el array 'cart', los estados de UI como 'isDrawerOpen' no.
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);