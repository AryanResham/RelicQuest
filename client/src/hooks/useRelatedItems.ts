import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { queryKeys } from '@/lib/queryKeys';
import type { Item } from '@/components/product-listing/types';

export function useRelatedItems(id: string | undefined, categoryId: number | null | undefined) {
  return useQuery<Item[]>({
    queryKey: queryKeys.items.related(id!),
    queryFn: async () => {
      const response = await api.get(`/items/${id}/related`, {
        params: { categoryId, limit: 4 },
      });
      if (response.data.success) {
        return response.data.data;
      }
      return [];
    },
    enabled: !!id && !!categoryId,
  });
}
