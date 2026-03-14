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
  revalidateCartStock: (products?: any[]) => void; 
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      isDrawerOpen: false,

      openDrawer: () => {
        console.log("LOG: openDrawer() llamado manualmente");
        set({ isDrawerOpen: true });
      },
      closeDrawer: () => {
        console.log("LOG: closeDrawer() llamado");
        set({ isDrawerOpen: false });
      },
      setCart: (newCart) => set({ cart: newCart }),
      clearCart: () => set({ cart: [] }),

      revalidateCartStock: (allProducts) => {
        if (!allProducts || allProducts.length === 0) return;
        const currentCart = get().cart;
        const updatedCart = currentCart.map(item => {
          const freshProduct = allProducts.find(p => (p.id || p._id) === item.id);
          return freshProduct ? { ...item, stock: Number(freshProduct.stock) } : item;
        });
        set({ cart: updatedCart });
      },

      addToCart: async (product, userId) => {
        console.log("--- INICIO addToCart ---");
        const productId = product.id || product._id;
        const currentCart = get().cart; 
        const existing = currentCart.find((item) => item.id === productId);
        const availableStock = Number(product.stock);

        console.log("LOG: Producto ID:", productId);
        console.log("LOG: Stock disponible:", availableStock);
        console.log("LOG: Cantidad actual en carrito:", existing?.quantity || 0);

        // 1. VALIDACIÓN DE STOCK
        if (existing && existing.quantity >= availableStock) {
          console.warn("LOG: ¡BLOQUEADO! Stock insuficiente. No debería abrir el Drawer.");
          
          // Forzamos el false aquí
          set({ isDrawerOpen: false });

          Swal.fire({
            title: '¡LÍMITE ALCANZADO!',
            text: 'Has alcanzado el stock máximo disponible.',
            icon: 'warning',
            iconColor: '#2563eb',
            confirmButtonText: 'ENTENDIDO',
            buttonsStyling: false,
            customClass: {
              popup: 'rounded-[2.5rem] border-4 border-blue-600',
              confirmButton: 'px-12 py-5 bg-blue-600 text-white font-black rounded-2xl'
            }
          });
          
          console.log("--- FIN addToCart (por error de stock) ---");
          return; 
        }

        // 2. PREPARACIÓN DE DATOS
        console.log("LOG: Validación pasada. Preparando carrito...");
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

        // 3. ACTUALIZACIÓN FINAL
        console.log("LOG: Seteando cart y isDrawerOpen: true");
        set({ 
          cart: updatedCart, 
          isDrawerOpen: true 
        });
        console.log("--- FIN addToCart (Exitoso) ---");
      },

      removeFromCart: async (productId) => {
        set({ cart: get().cart.filter((item) => item.id !== productId) });
      },

      updateQuantity: async (productId, newQuantity) => {
        const currentCart = get().cart;
        const item = currentCart.find(i => i.id === productId);

        if (item && newQuantity > item.stock) {
          console.warn("LOG: updateQuantity bloqueado por stock");
          return;
        }

        set({
          cart: currentCart.map((item) =>
            item.id === productId ? { ...item, quantity: Math.max(1, newQuantity) } : item
          ),
        });
      },
    }),
    { 
      name: 'cart-storage',
      partialize: (state) => ({ cart: state.cart }), // No guardamos el booleano en el storage
    }
  )
);