import api from "../axios";

// ============================================
// Auction API Functions
// ============================================

export interface Auction {
  id: string;
  title: string;
  description: string;
  currentBid: number;
  startingPrice: number;
  imageUrl: string;
  endsAt: string;
  sellerId: string;
  status: "active" | "ended" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface Bid {
  id: string;
  auctionId: string;
  userId: string;
  amount: number;
  createdAt: string;
}

// Get all auctions
export const getAuctions = async (params?: {
  status?: string;
  category?: string;
  limit?: number;
  offset?: number;
}) => {
  const response = await api.get<{ auctions: Auction[]; total: number }>("/api/auctions", { params });
  return response.data;
};

// Get single auction by ID
export const getAuction = async (id: string) => {
  const response = await api.get<Auction>(`/api/auctions/${id}`);
  return response.data;
};

// Create a new auction (protected)
export const createAuction = async (data: {
  title: string;
  description: string;
  startingPrice: number;
  imageUrl: string;
  endsAt: string;
  category?: string;
}) => {
  const response = await api.post<Auction>("/api/auctions", data);
  return response.data;
};

// Place a bid (protected)
export const placeBid = async (auctionId: string, amount: number) => {
  const response = await api.post<Bid>(`/api/auctions/${auctionId}/bids`, { amount });
  return response.data;
};

// Get bids for an auction
export const getAuctionBids = async (auctionId: string) => {
  const response = await api.get<Bid[]>(`/api/auctions/${auctionId}/bids`);
  return response.data;
};

// ============================================
// User API Functions
// ============================================

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: string;
}

// Get current user profile
export const getProfile = async () => {
  const response = await api.get<UserProfile>("/api/users/me");
  return response.data;
};

// Update user profile
export const updateProfile = async (data: {
  displayName?: string;
  avatarUrl?: string;
}) => {
  const response = await api.patch<UserProfile>("/api/users/me", data);
  return response.data;
};

// Get user's auctions
export const getMyAuctions = async () => {
  const response = await api.get<Auction[]>("/api/users/me/auctions");
  return response.data;
};

// Get user's bids
export const getMyBids = async () => {
  const response = await api.get<Bid[]>("/api/users/me/bids");
  return response.data;
};
