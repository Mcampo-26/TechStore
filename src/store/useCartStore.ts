import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  addToCart: (product: any, userId?: string, showDrawer?: boolean) => Promise<{ success: boolean; limit?: number }>;
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

      revalidateCartStock: (allProducts) => {
        if (!allProducts || allProducts.length === 0) return;
        
        const currentCart = get().cart;
        const updatedCart = currentCart.map(item => {
          const fresh = allProducts.find(p => (p._id || p.id) === item.id);
          
          if (fresh) {
            const freshStock = Number(fresh.stock);
            const priceBase = Number(fresh.price);
            const discountedPrice = fresh.isOferta 
              ? priceBase * (1 - (fresh.descuento || 0) / 100) 
              : priceBase;

            const adjustedQuantity = item.quantity > freshStock ? freshStock : item.quantity;
            
            return { 
              ...item, 
              price: discountedPrice, 
              stock: freshStock,
              quantity: adjustedQuantity > 0 ? adjustedQuantity : 1
            };
          }
          return item;
        });

        set({ cart: updatedCart });
      },

      addToCart: async (product, userId, showDrawer = true) => {
        const productId = product._id || product.id;
        const currentCart = get().cart;
        const existing = currentCart.find((item) => item.id === productId);
        const availableStock = Number(product.stock);

        // SI YA NO HAY STOCK O SE ALCANZÓ EL LÍMITE
        if (availableStock <= 0 || (existing && existing.quantity >= availableStock)) {
          return { success: false, limit: availableStock };
        }

        const priceBase = Number(product.price);
        const finalPrice = product.isOferta 
          ? priceBase * (1 - (product.descuento || 0) / 100) 
          : priceBase;

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
            price: finalPrice,
            image: product.image,
            quantity: 1,
            stock: availableStock,
          }];
        }

        set({ 
          cart: updatedCart, 
          isDrawerOpen: showDrawer ? true : get().isDrawerOpen 
        });

        if (userId) get().syncWithDB(userId, updatedCart);
        return { success: true };
      },

      removeFromCart: async (productId, userId) => {
        const updatedCart = get().cart.filter((item) => item.id !== productId);
        set({ cart: updatedCart });
        if (userId) get().syncWithDB(userId, updatedCart);
      },

      updateQuantity: async (productId, newQuantity, userId) => {
        const currentCart = get().cart;
        const item = currentCart.find(i => i.id === productId);
        if (!item) return;

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
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);