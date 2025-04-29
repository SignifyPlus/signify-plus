import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';
import { chatsQueryKey } from './chats-query';
import { queryClient } from '@/api';

export interface ArchiveChatParams {
  chatId: string;
  mainUserPhoneNumber: string;
}

// Normal async function to archive a chat manually
export async function archiveChat(chatId: string) {
  const response = await fetch(`${API_URL}/chats/${chatId}/archive`, {
    method: 'POST', // or PATCH if your backend prefers
  });

  if (!response.ok) {
    throw new Error('Failed to archive chat');
  }

  const data = await response.json();

  await queryClient.invalidateQueries({
    queryKey: ['chats'],
  });

  return data;
}

// React Query mutation hook for archiving
export const useArchiveChatMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: ArchiveChatParams) => {
      const response = await fetch(
        `${API_URL}/chats/${params.chatId}/archive`,
        {
          method: 'POST', // or PATCH
        }
      );

      if (!response.ok) {
        throw new Error('Failed to archive chat');
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
