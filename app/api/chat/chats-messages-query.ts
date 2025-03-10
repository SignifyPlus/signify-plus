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
  'chatMessages',
  chatId,
];

export const useChatMessagesQuery = (chatId?: string) => {
  const { isPending, error, data } = useQuery({
    queryKey: chatMessagesQueryKey(chatId || ''),
    queryFn: async () => {
      if (!chatId) return [];
      const response = await fetch(`${API_URL}/chats/custom/id/${chatId}`);
      if (!response.ok) throw new Error('Failed to fetch messages');

      const jsonResponse = await response.json();
      return jsonResponse.messages as Message[];
    },
    enabled: !!chatId,
  });

  return { isPending, error, data };
};
