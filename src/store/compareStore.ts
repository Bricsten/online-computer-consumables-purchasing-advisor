import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

interface CompareState {
  products: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  clearAll: () => void;
  isInCompare: (productId: string) => boolean;
  canAddMore: () => boolean;
}

const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      products: [],
      
      addProduct: (product: Product) => {
        set((state) => {
          if (state.products.length >= 4) {
            return state; // Maximum 4 products can be compared
          }
          
          if (state.products.some(p => p.id === product.id)) {
            return state; // Product already in compare list
          }
          
          return {
            products: [...state.products, product]
          };
        });
      },
      
      removeProduct: (productId: string) => {
        set((state) => ({
          products: state.products.filter(product => product.id !== productId)
        }));
      },
      
      clearAll: () => {
        set({ products: [] });
      },
      
      isInCompare: (productId: string) => {
        return get().products.some(product => product.id === productId);
      },
      
      canAddMore: () => {
        return get().products.length < 4;
      }
    }),
    {
      name: 'compare-storage',
    }
  )
);

export default useCompareStore;