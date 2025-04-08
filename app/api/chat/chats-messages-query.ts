import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';

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
  receiverIds: User[]; // Assuming receiverIds are an array of User objects
  senderId: User;
}

export const chatMessagesQueryKey = (chatId: string) => [
  'chats',
  'chatMessages',
  chatId,
];

export const useChatMessagesQuery = (chatId?: string) => {
  return useQuery({
    queryKey: [],
    queryFn: async () => {
      if (!chatId) return [];
      console.log('fetching messages for chat', chatId);
      const response = await fetch(`${API_URL}/chats/custom/id/${chatId}`);
      if (!response.ok) throw new Error('Failed to fetch messages');

      const jsonResponse = await response.json();
      return ((jsonResponse.messages ?? []) as Message[]).sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
    },
  });
};
