import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { queryKeys } from '@/lib/queryKeys';

interface UpdateProfileParams {
  userId: string;
  username?: string;
  avatarFile?: File;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, username, avatarFile }: UpdateProfileParams) => {
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        const avatarResponse = await api.put(`/users/${userId}/avatar`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (!avatarResponse.data.success) {
          throw new Error(avatarResponse.data.error || 'Failed to upload avatar');
        }
      }

      if (username) {
        const response = await api.put(`/users/${userId}`, { username });
        if (!response.data.success) {
          throw new Error(response.data.error || 'Failed to update username');
        }
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.profile(variables.userId) });
    },
  });
}
