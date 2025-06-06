import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug log
console.log('Initializing Supabase client with URL:', supabaseUrl);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test the connection
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Error connecting to Supabase:', error.message);
  } else {
    console.log('Successfully connected to Supabase');
  }
});

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  return error.message || 'An error occurred';
};

// Types for Supabase tables
export type DbUser = {
  id: string;
  email: string;
  full_name: string;
  phone_number: string | null;
  created_at: string;
  updated_at: string;
};

export type DbShippingAddress = {
  id: string;
  user_id: string;
  full_name: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export type DbPaymentMethod = {
  id: string;
  user_id: string;
  type: 'MTN_MOBILE_MONEY' | 'ORANGE_MONEY';
  mobile_number: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};