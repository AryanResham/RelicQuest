import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthContext } from '@/context/useAuthContext';

export interface WatchlistItem {
  id: number;
  item_id: number;
  created_at: string;
  item: {
    id: number;
    title: string;
    images: string[];
    current_price: number;
    end_time: string;
  };
}

export function useWatchlist() {
  const { user } = useAuthContext();

  return useQuery<WatchlistItem[]>({
    queryKey: queryKeys.watchlist,
    queryFn: async () => {
      const response = await api.get('/watchlist');
      if (response.data.success) return response.data.data;
      return [];
    },
    enabled: !!user,
    staleTime: 30_000,
  });
}

export function useToggleWatchlist(itemId: number) {
  const queryClient = useQueryClient();
  const { data: watchlist = [] } = useWatchlist();

  const isWatching = watchlist.some(w => w.item_id === itemId);

  const mutation = useMutation({
    mutationFn: async () => {
      if (isWatching) {
        await api.delete(`/watchlist/${itemId}`);
      } else {
        await api.post(`/watchlist/${itemId}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.watchlist });
    },
  });

  return { isWatching, toggle: mutation.mutate, isPending: mutation.isPending };
}
