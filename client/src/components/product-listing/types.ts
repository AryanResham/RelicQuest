export interface Seller {
  id: string;
  store_name: string;
  phone_no?: string;
  is_verified: boolean;
  rating: number;
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
  seller?: Seller;
}

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isEnded: boolean;
}

export interface Bid {
  id: number;
  item_id: number;
  user_id: string;
  amount: number;
  created_at: string;
  user?: {
    id: string;
    username: string | null;
  };
}
