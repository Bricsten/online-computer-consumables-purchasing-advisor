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
  email: string;
  fullName: string;
  phoneNumber: string | null;
  shippingAddresses: ShippingAddress[];
  paymentMethods: PaymentMethod[];
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
  currency: 'XAF';
}

export interface ShippingAddress {
  id?: string;
  userId?: string;
  fullName: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  isDefault: boolean;
}

export interface PaymentMethod {
  id?: string;
  userId?: string;
  type: 'MTN_MOBILE_MONEY' | 'ORANGE_MONEY';
  mobileNumber: string;
  isDefault: boolean;
}

export interface GuestInfo {
  full_name: string;
  email: string;
  phone_number: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: string;
  paymentMethod: string;
  paymentNumber: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    full_name: string;
    email: string;
    phone_number: string;
  };
  guestInfo?: GuestInfo;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
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

export type AdminRole = 'super_admin' | 'admin';

export interface Admin {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  createdAt: string;
  updatedAt: string;
}

export type NewProduct = Omit<Product, 'id' | 'rating' | 'reviews' | 'createdat' | 'updatedat'>;

export interface BilingualText {
  en: string;
  fr: string;
}

// Update Product interface
export interface Product {
  id: string;
  name: BilingualText;
  description: BilingualText;
  price: number;
  category: BilingualText;
  brand: string;
  instock: number;
  imageurl: string;
  specifications: {
    [key: string]: BilingualText;
  };
  features: BilingualText[];
  rating: number;
  reviews: Review[];
  createdat: string;
  updatedat: string;
}