import { useQuery } from '@tanstack/react-query';
import { getItemBids, type Bid } from '@/lib/bid';
import { queryKeys } from '@/lib/queryKeys';

export function useItemBids(itemId: number, limit: number = 5) {
  return useQuery<Bid[]>({
    queryKey: queryKeys.bids.byItem(itemId),
    queryFn: async () => {
      const result = await getItemBids(itemId, limit);
      if (result.success && result.data) return result.data;
      return [];
    },
    staleTime: Infinity,
  });
}

