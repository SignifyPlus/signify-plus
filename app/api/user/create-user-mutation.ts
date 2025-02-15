import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';

export interface CreateUserParams {
  name: string;
  phoneNumber: string;
  password: string;
  profilePicture?: string;
}

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateUserParams) => {
      console.log('Creating user', params);
      const response = await fetch(`${API_URL}/user/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        console.error(response);
        throw new Error('Failed to create user');
      }

      const data = await response.json();
      console.log('User created', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('Failed to create user', error);
    },
  });
};
