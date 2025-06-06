import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updatedProduct: Product) => void;
  deleteProduct: (id: string) => void;
}

const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
    const { data, error } = await supabase
      .from('products')
        .select('*')
        .order('createdat', { ascending: false });

      if (error) throw error;

      set({ 
        products: data || [], 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    set({
        error: 'Failed to fetch products', 
        isLoading: false 
      });
    }
  },

  addProduct: (product: Product) => {
    const { products } = get();
    set({ products: [product, ...products] });
  },

  updateProduct: (id: string, updatedProduct: Product) => {
    const { products } = get();
    set({
      products: products.map(product =>
        product.id === id ? updatedProduct : product
      )
    });
  },

  deleteProduct: (id: string) => {
    const { products } = get();
    set({
      products: products.filter(product => product.id !== id)
    });
  }
}));

export default useProductStore;