import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Admin } from '../types';

// Hardcoded admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@boltcameroon.com',
  password: 'admin123',
  fullName: 'Admin User',
  role: 'super_admin' as const
};

interface AdminAuthState {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      admin: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Check against hardcoded credentials
          if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
            set({
              admin: {
                id: '1', // Hardcoded ID since we're not using Supabase
                email: ADMIN_CREDENTIALS.email,
                fullName: ADMIN_CREDENTIALS.fullName,
                role: ADMIN_CREDENTIALS.role,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              },
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
            return true;
          } else {
            throw new Error('Invalid email or password');
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Login failed';
          set({ error: message, isLoading: false });
          return false;
        }
      },

      logout: async () => {
        set({
          admin: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      }
    }),
    {
      name: 'admin-auth-storage',
    }
  )
);

export default useAdminAuthStore; 