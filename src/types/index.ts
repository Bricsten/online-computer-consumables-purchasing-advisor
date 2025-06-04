export interface Product {
  id: string;
  name: {
    en: string;
    fr: string;
  };
  description: {
    en: string;
    fr: string;
  };
  price: number;
  category: {
    en: string;
    fr: string;
  };
  brand: string;
  instock: number;
  imageurl: string;
  specifications: {
    [key: string]: {
      en: string;
      fr: string;
    };
  };
  features: Array<{
    en: string;
    fr: string;
  }>;
  rating: number;
  reviews: Review[];
  createdat: string;
  updatedat: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingInfo {
  name: string;
  address: string;
  city: string;
  phoneNumber: string;
  distance?: number;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  total: number;
}

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: {
            en: string;
            fr: string;
          };
          description: {
            en: string;
            fr: string;
          };
          price: number;
          category: {
            en: string;
            fr: string;
          };
          brand: string;
          in_stock: number;
          image_url: string;
          specifications: {
            [key: string]: {
              en: string;
              fr: string;
            };
          };
          features: Array<{
            en: string;
            fr: string;
          }>;
          rating: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: {
            en: string;
            fr: string;
          };
          description: {
            en: string;
            fr: string;
          };
          price: number;
          category: {
            en: string;
            fr: string;
          };
          brand: string;
          in_stock: number;
          image_url: string;
          specifications: {
            [key: string]: {
              en: string;
              fr: string;
            };
          };
          features: Array<{
            en: string;
            fr: string;
          }>;
          rating?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: {
            en: string;
            fr: string;
          };
          description?: {
            en: string;
            fr: string;
          };
          price?: number;
          category?: {
            en: string;
            fr: string;
          };
          brand?: string;
          in_stock?: number;
          image_url?: string;
          specifications?: {
            [key: string]: {
              en: string;
              fr: string;
            };
          };
          features?: Array<{
            en: string;
            fr: string;
          }>;
          rating?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}