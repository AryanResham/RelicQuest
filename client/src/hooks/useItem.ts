import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { queryKeys } from '@/lib/queryKeys';
import type { Item } from '@/components/product-listing/types';

export function useItem(id: string | undefined) {
  return useQuery<Item>({
    queryKey: queryKeys.items.detail(id!),
    queryFn: async () => {
      const response = await api.get(`/items/${id}`);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error('Item not found');
    },
    enabled: !!id,
  });
}
