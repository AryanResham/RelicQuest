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
