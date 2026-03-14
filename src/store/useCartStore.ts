// @/store/useCartStore.ts
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
  addToCart: (product: any, userId?: string) => Promise<void>;
  removeFromCart: (productId: string, userId?: string) => Promise<void>;
  updateQuantity: (productId: string, newQuantity: number, userId?: string) => Promise<void>;
  // AGREGAMOS ESTA LÍNEA PARA SOLUCIONAR EL ERROR DEL BUILD
  revalidateCartStock: (products: any[]) => void; 
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      isDrawerOpen: false,

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      setCart: (newCart) => set({ cart: newCart }),

      // Implementamos la función que pide la página de carrito
      revalidateCartStock: (allProducts) => {
        const currentCart = get().cart;
        const updatedCart = currentCart.map(item => {
          const freshProduct = allProducts.find(p => (p.id || p._id) === item.id);
          return freshProduct ? { ...item, stock: freshProduct.stock } : item;
        });
        set({ cart: updatedCart });
      },

      addToCart: async (product, userId) => {
        const productId = product.id || product._id;
        const currentCart = get().cart; 
        const existing = currentCart.find((item) => item.id === productId);
        const availableStock = Number(product.stock);

        if (existing && existing.quantity >= availableStock) {
          set({ isDrawerOpen: false });
          Swal.fire({
            title: '¡LÍMITE ALCANZADO!',
            text: 'Has alcanzado el stock máximo disponible.',
            icon: 'warning',
            iconColor: '#2563eb',
            background: '#ffffff',
            color: '#000000',
            confirmButtonText: 'ENTENDIDO',
            buttonsStyling: false,
            customClass: {
              popup: 'rounded-[2.5rem] border-4 border-blue-600 !opacity-100',
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
            name: product.name || "Producto",
            description: product.description || "",
            price: Number(product.price) || 0,
            image: product.image || "/placeholder.png",
            quantity: 1,
            stock: availableStock,
          }];
        }
        set({ cart: updatedCart, isDrawerOpen: true });
      },

      removeFromCart: async (productId) => {
        set({ cart: get().cart.filter((item) => item.id !== productId) });
      },

      updateQuantity: async (productId, newQuantity) => {
        set({
          cart: get().cart.map((item) =>
            item.id === productId ? { ...item, quantity: Math.max(1, newQuantity) } : item
          ),
        });
      },
    }),
    { name: 'cart-storage' }
  )
);