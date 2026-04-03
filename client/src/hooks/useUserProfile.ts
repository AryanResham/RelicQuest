import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { queryKeys } from '@/lib/queryKeys';

export function useUserProfile(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.users.profile(userId!),
    queryFn: async () => {
      const response = await api.get(`/users/${userId}`);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error('Failed to fetch profile');
    },
    enabled: !!userId,
  });
}
