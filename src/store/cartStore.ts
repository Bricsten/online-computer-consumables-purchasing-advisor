import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, OrderSummary, ShippingInfo } from '../types';

interface CartState {
  items: CartItem[];
  shippingInfo: ShippingInfo | null;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getOrderSummary: () => OrderSummary;
  setShippingInfo: (info: ShippingInfo) => void;
  calculateShippingCost: (city: string) => number;
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      shippingInfo: null,
      
      addItem: (product: Product, quantity: number) => {
        set((state) => {
          const existingItem = state.items.find(item => item.product.id === product.id);
          
          if (existingItem) {
            return {
              items: state.items.map(item => 
                item.product.id === product.id 
                  ? { ...item, quantity: item.quantity + quantity } 
                  : item
              )
            };
          } else {
            return {
              items: [...state.items, { product, quantity }]
            };
          }
        });
      },
      
      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter(item => item.product.id !== productId)
        }));
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        set((state) => ({
          items: state.items.map(item => 
            item.product.id === productId 
              ? { ...item, quantity } 
              : item
          )
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getCartCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getOrderSummary: () => {
        const state = get();
        const subtotal = state.items.reduce(
          (sum, item) => sum + (item.product.price * item.quantity), 
          0
        );
        
        const shipping = state.shippingInfo 
          ? state.calculateShippingCost(state.shippingInfo.city) 
          : 0;
          
        return {
          subtotal,
          shipping,
          total: subtotal + shipping
        };
      },
      
      setShippingInfo: (info: ShippingInfo) => {
        set({ shippingInfo: info });
      },
      
      calculateShippingCost: (city: string): number => {
        const cityDistances: { [key: string]: number } = {
          'buea': 0,
          'limbe': 28,
          'douala': 70,
          'kumba': 75,
          'yaounde': 310,
          'bamenda': 400,
          'garoua': 1000,
          'maroua': 1250,
          'ngaoundere': 920,
          'ebolowa': 400,
          'kribi': 150
        };

        const selectedCity = city.toLowerCase();
        
        if (selectedCity === 'buea') {
          return 1100; // Fixed rate for Buea
        }
        
        const cityDistance = cityDistances[selectedCity];
        if (cityDistance !== undefined) {
          return cityDistance * 50; // 50 XAF per kilometer for other cities
        }
        
        return 0; // Return 0 for unknown cities
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;