import api from './axios';

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

export interface PlaceBidResponse {
  success: boolean;
  data?: Bid;
  error?: string;
}

export interface GetBidsResponse {
  success: boolean;
  data?: Bid[];
  error?: string;
}

/**
 * Place a bid on an item
 */
export const placeBid = async (itemId: number, amount: number): Promise<PlaceBidResponse> => {
  try {
    const response = await api.post('/bids', {
      item_id: itemId,
      amount: amount
    });
    return response.data;
  } catch (error: unknown) {
    console.error('Error placing bid:', error);
    // Extract error message from API response if available
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { error?: string } } };
      return { 
        success: false, 
        error: axiosError.response?.data?.error || 'Failed to place bid' 
      };
    }
    return { success: false, error: 'Failed to place bid' };
  }
};

/**
 * Get bids for an item
 */
export const getItemBids = async (itemId: number, limit: number = 10): Promise<GetBidsResponse> => {
  try {
    const response = await api.get(`/bids/item/${itemId}`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching bids:', error);
    return { success: false, error: 'Failed to fetch bids' };
  }
};
