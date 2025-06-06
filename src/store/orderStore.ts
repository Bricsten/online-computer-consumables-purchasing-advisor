import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  user_id?: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  shipping: number;
  payment_method: string;
  shipping_address: string;
  created_at: string;
  receipt_url?: string;
}

interface OrderStore {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  createOrder: (order: Omit<Order, 'id' | 'created_at'>) => Promise<Order>;
  fetchUserOrders: (userId: string) => Promise<void>;
}

const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  isLoading: false,
  error: null,

  createOrder: async (order) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('orders')
        .insert([order])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        orders: [data, ...state.orders],
        isLoading: false
      }));

      return data;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  fetchUserOrders: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ orders: data || [], isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  }
}));

export default useOrderStore; 