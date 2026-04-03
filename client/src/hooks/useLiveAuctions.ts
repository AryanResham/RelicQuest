import { useQuery, keepPreviousData } from '@tanstack/react-query';
import api from '@/lib/axios';
import { queryKeys } from '@/lib/queryKeys';

interface AuctionItem {
  id: number;
  title: string;
  description: string;
  images: string[];
  current_price: number;
  end_time: string;
  category_id: number;
}

interface LiveAuctionsResponse {
  auctions: AuctionItem[];
  total: number;
}

export function useLiveAuctions(page: number, limit: number) {
  return useQuery<LiveAuctionsResponse>({
    queryKey: queryKeys.items.live(page, limit),
    queryFn: async () => {
      const response = await api.get(`/items/live?page=${page}&limit=${limit}`);
      if (response.data.success) {
        return {
          auctions: response.data.data,
          total: response.data.total || 0,
        };
      }
      throw new Error('Failed to load auctions');
    },
    placeholderData: keepPreviousData,
  });
}
