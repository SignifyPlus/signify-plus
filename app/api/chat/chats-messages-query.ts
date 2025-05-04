import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';
import { getToken } from '../axios';
import { fetchWithAuth } from '..';

export interface User {
  _id: string;
  name: string;
  phoneNumber: string;
}

export interface Message {
  __v: number;
  _id: string;
  chatId: string;
  content: string;
  createdAt: string;
  receiverIds: User[];
  senderId: User;
}

export const chatMessagesQueryKey = (chatId: string) => [
  'chats',
  'chatMessages',
  chatId,
];

export const useChatMessagesQuery = (chatId?: string) => {
  return useQuery({
    queryKey: chatMessagesQueryKey(chatId ?? ''),
    refetchInterval: 500,
    queryFn: async () => {
      if (!chatId) return [];
      const response = await fetchWithAuth(
        `${API_URL}/chats/custom/id/${chatId}`,
        {
          headers: {
            Authorization: await getToken(),
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch chat messages');
      }
      const data = await response.json();
      return ((data.messages ?? []) as Message[]).sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
    },
  });
};
