import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';
import { chatsQueryKey } from './chats-query';

export interface CreateChatParams {
  mainUserPhoneNumber: string;
  participants: string[];
}

export const useCreateChatMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateChatParams) => {
      console.log('Creating chat', params);
      const response = await fetch(`${API_URL}/chats/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        console.error(response);
        throw new Error('Failed to create chat');
      }

      const data = await response.json();
      console.log('Chat created', data);
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: chatsQueryKey({ phoneNumber: variables.mainUserPhoneNumber }),
      });
    },
  });
};
