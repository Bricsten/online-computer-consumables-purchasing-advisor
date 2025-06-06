import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Review {
  id: string;
  user_id: string;
  username: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewStore {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  fetchReviews: () => Promise<void>;
  addReview: (review: Omit<Review, 'id' | 'created_at'>) => Promise<void>;
}

const useReviewStore = create<ReviewStore>((set) => ({
  reviews: [],
  isLoading: false,
  error: null,

  fetchReviews: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          user_id,
          username,
          user_avatar,
          rating,
          comment,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ reviews: data || [], isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addReview: async (review) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('reviews')
        .insert([review])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        reviews: [data, ...state.reviews],
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  }
}));

export default useReviewStore; 