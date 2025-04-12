import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';
import { chatMessagesQueryKey } from '@/api/chat/chats-messages-query';
// import { chatsQueryKey } from '../chat/chats-query';

export interface SendMessageParams {
  mainUserPhoneNumber: string;
  targetUserPhoneNumbers: string[];
  message: string;
  chatId: string;
}

export const useSendMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SendMessageParams) => {
      const response = await fetch(`${API_URL}/messages/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        // queryKey: chatsQueryKey({ phoneNumber: variables.mainUserPhoneNumber }),
        queryKey: chatMessagesQueryKey(variables.chatId),
      });
    },
  });
};
