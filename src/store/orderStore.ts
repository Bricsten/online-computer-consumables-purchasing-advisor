import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Order as OrderType, OrderItem, GuestInfo } from '../types';

export interface Order extends OrderType {}

interface OrderStore {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Order>;
  fetchUserOrders: (userId: string) => Promise<void>;
}

const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  isLoading: false,
  error: null,

  createOrder: async (order) => {
    try {
      set({ isLoading: true, error: null });
      
      const orderData = {
        ...order,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;

      // Transform the data to match the Order type
      const transformedOrder: Order = {
        id: data.id,
        userId: data.user_id,
        items: data.items,
        subtotal: data.subtotal,
        shipping: data.shipping,
        total: data.total,
        shippingAddress: data.shipping_address,
        paymentMethod: data.payment_method,
        paymentNumber: data.payment_number,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        guestInfo: data.guest_info
      };

      set((state) => ({
        orders: [transformedOrder, ...state.orders],
        isLoading: false
      }));

      return transformedOrder;
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

      // Transform the data to match the Order type
      const transformedOrders: Order[] = (data || []).map(order => ({
        id: order.id,
        userId: order.user_id,
        items: order.items,
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
        shippingAddress: order.shipping_address,
        paymentMethod: order.payment_method,
        paymentNumber: order.payment_number,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        guestInfo: order.guest_info
      }));

      set({ orders: transformedOrders, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  }
}));

export default useOrderStore; 