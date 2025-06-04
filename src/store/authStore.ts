import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (error) {
            console.error('Login error:', error.message);
            return false;
          }

          if (data.user) {
            set({ 
              user: {
                id: data.user.id,
                username: data.user.email || '',
                role: 'admin'
              }, 
              isAuthenticated: true 
            });
            return true;
          }

          return false;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },
      
      logout: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) {
            console.error('Logout error:', error.message);
          }
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error('Logout error:', error);
        }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;