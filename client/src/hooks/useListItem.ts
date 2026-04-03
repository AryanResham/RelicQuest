import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { queryKeys } from '@/lib/queryKeys';

interface ListItemParams {
  title: string;
  description: string;
  category: string;
  startPrice: string;
  minPrice: string;
  bidIncrement: string;
  endTime: string;
  files: File[];
}

export function useListItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, description, category, startPrice, minPrice, bidIncrement, endTime, files }: ListItemParams) => {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('start_price', startPrice);
      formData.append('end_time', endTime);

      if (minPrice) formData.append('min_price', minPrice);
      if (bidIncrement) formData.append('bid_increment', bidIncrement);
      if (category) formData.append('category_id', category);

      files.forEach(file => formData.append('images', file));

      const response = await api.post('/items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate live auctions list so the new item appears
      queryClient.invalidateQueries({ queryKey: queryKeys.items.all });
    },
  });
}
