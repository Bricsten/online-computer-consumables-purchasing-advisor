import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, ShippingAddress, PaymentMethod } from '../types';
import { supabase, handleSupabaseError } from '../lib/supabase';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, fullName: string, phoneNumber?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  addShippingAddress: (address: Omit<ShippingAddress, 'id' | 'userId'>) => Promise<void>;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id' | 'userId'>) => Promise<void>;
  setDefaultShippingAddress: (addressId: string) => Promise<void>;
  setDefaultPaymentMethod: (methodId: string) => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          console.log('Attempting to sign in with email:', email);
          
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (authError) {
            console.error('Authentication error:', authError);
            throw authError;
          }

          console.log('Auth successful:', authData);

          if (authData.user) {
            console.log('Fetching user data for ID:', authData.user.id);
            
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*, shipping_addresses(*), payment_methods(*)')
              .eq('id', authData.user.id)
              .single();

            if (userError) {
              console.error('Error fetching user data:', userError);
              throw userError;
            }

            console.log('User data fetched:', userData);

            set({ 
              user: {
                id: authData.user.id,
                email: authData.user.email!,
                fullName: userData.full_name,
                phoneNumber: userData.phone_number,
                shippingAddresses: userData.shipping_addresses || [],
                paymentMethods: userData.payment_methods || []
              },
              isAuthenticated: true,
              isLoading: false
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Login error:', error);
          set({ error: handleSupabaseError(error), isLoading: false });
          return false;
        }
      },

      register: async (email: string, password: string, fullName: string, phoneNumber?: string) => {
        set({ isLoading: true, error: null });
        try {
          // First check auth.users using signUp (this will fail if user exists)
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                phone_number: phoneNumber || null
              }
            }
          });

          if (authError) {
            // If user exists in auth.users, try to create just the public.users record
            if (authError.message.includes('already registered')) {
              // Try to sign in to get the user ID
              const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
              });

              if (signInError) {
                throw new Error('This email is already registered. Please sign in instead.');
              }

              if (signInData.user) {
                // Check if user exists in public.users
                const { data: existingUser } = await supabase
                  .from('users')
                  .select('id')
                  .eq('id', signInData.user.id)
                  .single();

                if (!existingUser) {
                  // Create user record in public.users table
                  const { error: userError } = await supabase
                    .from('users')
                    .insert([
                      {
                        id: signInData.user.id,
                        email: email,
                        full_name: fullName,
                        phone_number: phoneNumber || null,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                      }
                    ]);

                  if (userError) {
                    console.error('Error creating user record:', userError);
                    throw userError;
                  }

                  // Set the user state
                  set({ 
                    user: {
                      id: signInData.user.id,
                      email: email,
                      fullName: fullName,
                      phoneNumber: phoneNumber || null,
                      shippingAddresses: [],
                      paymentMethods: []
                    },
                    isAuthenticated: true,
                    isLoading: false
                  });
                  return true;
                }
              }
              throw new Error('This email is already registered. Please sign in instead.');
            }
            throw authError;
          }

          if (!authData.user) {
            throw new Error('Registration failed - no user data received');
          }

          // Create user record in public.users table
          const { error: userError } = await supabase
            .from('users')
            .insert([
              {
                id: authData.user.id,
                email: email,
                full_name: fullName,
                phone_number: phoneNumber || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ]);

          if (userError) {
            console.error('Error creating user record:', userError);
            // If we fail to create the user record, clean up the auth user
            await supabase.auth.signOut();
            throw userError;
          }

          console.log('User record created successfully');

          set({ 
            user: {
              id: authData.user.id,
              email: email,
              fullName: fullName,
              phoneNumber: phoneNumber || null,
              shippingAddresses: [],
              paymentMethods: []
            },
            isAuthenticated: true,
            isLoading: false
          });
          return true;

        } catch (error: any) {
          console.error('Registration error:', error);
          
          // Handle specific error cases
          const errorMessage = error.message?.toLowerCase() || '';
          if (errorMessage.includes('already registered') || errorMessage.includes('already exists')) {
            set({ 
              error: 'This email is already registered. Please sign in instead.',
              isLoading: false 
            });
          } else {
            set({ 
              error: handleSupabaseError(error),
              isLoading: false 
            });
          }
          return false;
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      updateProfile: async (data: Partial<User>) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase
            .from('users')
            .update({
              full_name: data.fullName,
              phone_number: data.phoneNumber
            })
            .eq('id', get().user?.id);

          if (error) throw error;

          set(state => ({
            user: state.user ? { ...state.user, ...data } : null,
            isLoading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      addShippingAddress: async (address: Omit<ShippingAddress, 'id' | 'userId'>) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('shipping_addresses')
            .insert([
              {
                user_id: get().user?.id,
                ...address
              }
            ])
            .select()
            .single();

          if (error) throw error;

          set(state => ({
            user: state.user ? {
              ...state.user,
              shippingAddresses: [...(state.user.shippingAddresses || []), data]
            } : null,
            isLoading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      addPaymentMethod: async (method: Omit<PaymentMethod, 'id' | 'userId'>) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('payment_methods')
            .insert([
              {
                user_id: get().user?.id,
                ...method
              }
            ])
            .select()
            .single();

          if (error) throw error;

          set(state => ({
            user: state.user ? {
              ...state.user,
              paymentMethods: [...(state.user.paymentMethods || []), data]
            } : null,
            isLoading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      setDefaultShippingAddress: async (addressId: string) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase
            .from('shipping_addresses')
            .update({ is_default: false })
            .eq('user_id', get().user?.id);

          if (error) throw error;

          const { error: error2 } = await supabase
            .from('shipping_addresses')
            .update({ is_default: true })
            .eq('id', addressId);

          if (error2) throw error2;

          set(state => ({
            user: state.user ? {
              ...state.user,
              shippingAddresses: state.user.shippingAddresses?.map(addr => ({
                ...addr,
                isDefault: addr.id === addressId
              }))
            } : null,
            isLoading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      setDefaultPaymentMethod: async (methodId: string) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase
            .from('payment_methods')
            .update({ is_default: false })
            .eq('user_id', get().user?.id);

          if (error) throw error;

          const { error: error2 } = await supabase
            .from('payment_methods')
            .update({ is_default: true })
            .eq('id', methodId);

          if (error2) throw error2;

          set(state => ({
            user: state.user ? {
              ...state.user,
              paymentMethods: state.user.paymentMethods?.map(method => ({
                ...method,
                isDefault: method.id === methodId
              }))
            } : null,
            isLoading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;