// User interface matching Supabase schema
export interface User {
  id: string;
  email: string;
  username: string | null;
  f_name: string | null;
  l_name: string | null;
  avatar: string | null;
  is_seller: boolean;
  created_at: string;
}

// Seller interface matching Supabase schema
export interface Seller {
  id: string;
  created_at: string;
  store_name: string | null;
  phone_no: string | null;
  is_verified: boolean;
  rating: number | null;
}

// DTO for updating user (only username allowed, avatar handled separately)
export interface UpdateUserDTO {
  username?: string;
}

// DTO for updating seller
export interface UpdateSellerDTO {
  store_name?: string;
  phone_no?: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Extend Express Request to include authenticated user
import type { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}


export interface Item {
  id: number;
  title: string;
  description: string;
  images: string[];
  start_price: number;
  min_price: number;
  bid_increment: number;
  current_price: number;
  start_time: string;
  end_time: string;
  status: string;
  seller_id: string;
  winner_id: string | null;
  category_id: number | null;
  is_verified: boolean;
  created_at?: string;
}

// Seller info interface for joined queries
export interface ItemWithSeller extends Item {
  seller?: {
    id: string;
    store_name: string;
    phone_no?: string;
    is_verified: boolean;
    rating: number;
  };
}

// Bid interface matching Supabase schema
export interface Bid {
  id: number;
  item_id: number;
  user_id: string;
  amount: number;
  created_at: string;
}

// Bid with user info for display
export interface BidWithUser extends Bid {
  user?: {
    id: string;
    username: string | null;
  };
}

// DTO for placing a bid
export interface PlaceBidDTO {
  item_id: number;
  amount: number;
}

// Bid with nested item and seller for user profile
export interface UserBidWithItem extends Bid {
  item: {
    id: number;
    title: string;
    images: string[];
    current_price: number;
    end_time: string;
    seller?: {
      store_name: string | null;
    } | null;
  };
}