import { Request } from 'express';

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at?: Date;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  dosage: string;
  pack_size: string;
  price: number;
  original_price?: number;
  stock_count: number;
  requires_rx: boolean;
  image_url: string;
  badge?: string;
  rating?: number;
  reviews_count?: number;
  active_ingredient?: string;
  usage_instructions?: string;
  side_effects?: string;
  created_at?: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  user_id: number | null;
  razorpay_order_id: string;
  total_amount: number;
  status: string;
  shipping_address: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  created_at?: Date;
  items?: OrderItem[];
}

export interface OrderItem {
  id?: number;
  order_id: number;
  product_id: string;
  quantity: number;
  unit_price: number;
  product_name?: string;
  product_image?: string;
}

export interface Payment {
  id?: number;
  order_id: number;
  razorpay_payment_id: string;
  razorpay_signature?: string;
  status: string;
  amount: number;
  created_at?: Date;
}

export interface RequestWithRawBody extends Request {
  rawBody?: Buffer;
}

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: number;
      name: string;
      email: string;
    };
    cartItems?: {
      productId: string;
      quantity: number;
    }[];
    couponCode?: string;
  }
}
