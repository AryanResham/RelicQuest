import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { queryKeys } from '@/lib/queryKeys';

export interface WonItem {
  id: number;
  title: string;
  images: string[];
  current_price: number;
  end_time: string;
  seller?: { store_name: string | null } | null;
}

export function useWonItems() {
  return useQuery<WonItem[]>({
    queryKey: queryKeys.items.won,
    queryFn: async () => {
      const response = await api.get('/items/won');
      if (response.data.success) return response.data.data;
      return [];
    },
    staleTime: 60_000,
  });
}
