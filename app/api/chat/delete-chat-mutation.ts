import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';
import { chatsQueryKey } from './chats-query';
import { queryClient } from '@/api';

export interface DeleteChatParams {
  chatId: string;
  mainUserPhoneNumber: string;
}

export async function deleteChat(chatId: string) {
  const response = await fetch(`${API_URL}/chats/${chatId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete chat');
  }

  const data = await response.json();

  await queryClient.invalidateQueries({
    queryKey: ['chats'],
  });

  return data;
}

export const useDeleteChatMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: DeleteChatParams) => {
      const response = await fetch(`${API_URL}/chats/${params.chatId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete chat');
      }

      const data = await response.json();
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: chatsQueryKey({ phoneNumber: variables.mainUserPhoneNumber }),
      });
    },
  });
};
