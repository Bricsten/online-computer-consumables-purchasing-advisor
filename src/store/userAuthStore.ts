import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface UserAuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const useUserAuthStore = create<UserAuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        if (data.user) {
          set({ user: data.user, isAuthenticated: true });
        }
      },
      signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'user-auth-storage',
    }
  )
);

export default useUserAuthStore; 