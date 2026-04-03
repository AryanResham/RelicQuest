import { useMutation, useQueryClient } from '@tanstack/react-query';
import { placeBid, type PlaceBidResponse } from '@/lib/bid';
import { queryKeys } from '@/lib/queryKeys';

export function usePlaceBid(itemId: number, itemDetailId?: string) {
  const queryClient = useQueryClient();

  return useMutation<PlaceBidResponse, Error, number>({
    mutationFn: (amount: number) => placeBid(itemId, amount),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: queryKeys.bids.byItem(itemId) });
        if (itemDetailId) {
          queryClient.invalidateQueries({ queryKey: queryKeys.items.detail(itemDetailId) });
        }
      }
    },
  });
}
