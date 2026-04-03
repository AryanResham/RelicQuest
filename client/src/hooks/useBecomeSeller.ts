import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { queryKeys } from '@/lib/queryKeys';

interface BecomeSellerParams {
  userId: string;
  store_name: string;
  phone_no?: string;
}

export function useBecomeSeller() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ store_name, phone_no }: BecomeSellerParams) => {
      const response = await api.post('/sellers', { store_name, phone_no });
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate user profile so is_seller reflects immediately
      queryClient.invalidateQueries({ queryKey: queryKeys.users.profile(variables.userId) });
    },
  });
}
