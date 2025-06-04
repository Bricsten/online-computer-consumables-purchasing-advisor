import { create } from 'zustand';
import { Product } from '../types';
import { supabase } from '../lib/supabase';

interface ProductState {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updatedProduct: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  fetchProducts: () => Promise<void>;
}

const useProductStore = create<ProductState>()((set, get) => ({
  products: [],
  
  fetchProducts: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    if (error) {
      console.error('Error fetching products from Supabase:', error);
      return;
    }
    set({
      products: (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        brand: p.brand,
        instock: p.instock,
        imageurl: p.imageurl,
        specifications: p.specifications,
        features: p.features,
        rating: p.rating,
        reviews: p.reviews || [],
        createdat: p.createdat,
        updatedat: p.updatedat,
      }))
    });
  },

  addProduct: async (product: Product) => {
    const { error } = await supabase.from('products').insert([
      {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        brand: product.brand,
        instock: product.instock,
        imageurl: product.imageurl,
        specifications: product.specifications,
        features: product.features,
        rating: product.rating,
        reviews: product.reviews,
        createdat: product.createdat,
        updatedat: product.updatedat,
      }
    ]);
    if (error) {
      console.error('Error adding product to Supabase:', error);
      return;
    }
    await get().fetchProducts();
  },

  updateProduct: async (id: string, updatedProduct: Partial<Product>) => {
    const { error } = await supabase.from('products').update({
      ...(updatedProduct.name ? { name: updatedProduct.name } : {}),
      ...(updatedProduct.description ? { description: updatedProduct.description } : {}),
      ...(updatedProduct.price !== undefined ? { price: updatedProduct.price } : {}),
      ...(updatedProduct.category ? { category: updatedProduct.category } : {}),
      ...(updatedProduct.brand ? { brand: updatedProduct.brand } : {}),
      ...(updatedProduct.instock !== undefined ? { instock: updatedProduct.instock } : {}),
      ...(updatedProduct.imageurl ? { imageurl: updatedProduct.imageurl } : {}),
      ...(updatedProduct.specifications ? { specifications: updatedProduct.specifications } : {}),
      ...(updatedProduct.features ? { features: updatedProduct.features } : {}),
      ...(updatedProduct.rating !== undefined ? { rating: updatedProduct.rating } : {}),
      ...(updatedProduct.reviews ? { reviews: updatedProduct.reviews } : {}),
      updatedat: new Date().toISOString(),
    }).eq('id', id);
    if (error) {
      console.error('Error updating product in Supabase:', error);
      return;
    }
    await get().fetchProducts();
  },

  deleteProduct: async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error('Error deleting product from Supabase:', error);
      return;
    }
    await get().fetchProducts();
  },
  
  getProduct: (id: string) => {
    return get().products.find(product => product.id === id);
  }
}));

export default useProductStore;