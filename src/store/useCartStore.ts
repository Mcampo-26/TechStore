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
  setCart: (newCart: CartItem[]) => void; // Añadido para corregir el error de Turbopack
  addToCart: (product: any, userId?: string) => Promise<void>;
  removeFromCart: (productId: string, userId?: string) => Promise<void>;
  updateQuantity: (productId: string, newQuantity: number, userId?: string) => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      isDrawerOpen: false,

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      
      // Acción para setear el carrito directamente (limpieza o sincronización)
      setCart: (newCart) => set({ cart: newCart }),

      addToCart: async (product, userId) => {
        const productId = product.id || product._id;
        const currentCart = get().cart; 
        const existing = currentCart.find((item) => item.id === productId);
        const availableStock = Number(product.stock);

        // 1. VALIDACIÓN DE STOCK MÁXIMO
        if (existing && existing.quantity >= availableStock) {
          // Cerramos el drawer inmediatamente para que no se encime con la alerta
          set({ isDrawerOpen: false });

          Swal.fire({
            title: '¡LÍMITE ALCANZADO!',
            text: 'Has alcanzado el stock máximo disponible para este producto.',
            icon: 'warning',
            iconColor: '#2563eb',
            background: '#ffffff', // Fondo sólido para evitar transparencias
            color: '#000000',      // Texto negro sólido
            showConfirmButton: true,
            confirmButtonText: 'ENTENDIDO',
            confirmButtonColor: '#2563eb',
            buttonsStyling: false,
            customClass: {
              popup: 'rounded-[2.5rem] border-4 border-blue-600 shadow-[0_0_50px_rgba(0,0,0,0.3)] !opacity-100',
              title: 'font-black uppercase italic tracking-tighter text-3xl !text-black',
              htmlContainer: '!font-black !opacity-100 text-sm uppercase tracking-wide !text-gray-800',
              confirmButton: 'px-12 py-5 bg-blue-600 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-500/40'
            }
          });
          
          return; // Detenemos la ejecución aquí
        }

        // 2. LÓGICA DE ACTUALIZACIÓN
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

        // Si no hubo error de stock, actualizamos el carrito y abrimos el banner
        set({ cart: updatedCart, isDrawerOpen: true });
        
        if (userId) { /* sync logic */ }
      },

      removeFromCart: async (productId, userId) => {
        const updatedCart = get().cart.filter((item) => item.id !== productId);
        set({ cart: updatedCart });
      },

      updateQuantity: async (productId, newQuantity, userId) => {
        const updatedCart = get().cart.map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(1, newQuantity) } : item
        );
        set({ cart: updatedCart });
      },
    }),
    { name: 'cart-storage' }
  )
);