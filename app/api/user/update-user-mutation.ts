import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';
import { User } from './login-user-mutation';

export interface UpdateUserParams {
  phoneNumber: string;
  password?: string;
  profileStatus?: string;
  name?: string;
  profilePicture?: string;
}

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateUserParams) => {
      const response = await fetch(`${API_URL}/users/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      return (await response.json()) as User;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user'],
      });
    },
  });
};
