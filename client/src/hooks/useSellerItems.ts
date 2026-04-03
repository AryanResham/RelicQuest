import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { queryKeys } from '@/lib/queryKeys';

export interface SellerItem {
  id: number;
  title: string;
  images: string[];
  current_price: number;
  end_time: string;
  start_price: number;
  is_verified: boolean;
}

export function useSellerItems() {
  return useQuery<SellerItem[]>({
    queryKey: queryKeys.items.bySeller,
    queryFn: async () => {
      const response = await api.get('/items/seller');
      if (response.data.success) return response.data.data;
      return [];
    },
    staleTime: 30_000,
  });
}
