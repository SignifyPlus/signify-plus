import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';
import { getToken } from '../axios';
import { fetchWithAuth } from '..';

type User = {
  _id: string;
  name: string;
  phoneNumber: string;
  profilePicture?: string | null;
};

export type Chat = {
  _id: string;
  mainUserId: User;
  participants: User[];
  totalNumberOfMessages: number;
  totalNumberOfMessagesInChat: number;
  createdAt: string;
  __v: number;
  lastMessage: string;
  archivedBy: string[];
  pinnedBy: string[];
  isPinned: boolean;
  deletedBy: string[];
};

export const chatsQueryKey = (params: { phoneNumber?: string }) => [
  'chats',
  params.phoneNumber,
];

export const useChatsQuery = (params: { phoneNumber?: string }) => {
  return useQuery({
    refetchInterval: 500,
    queryKey: chatsQueryKey(params),
    queryFn: async () => {
      if (!params.phoneNumber) return [];

      const response = await fetchWithAuth(
        `${API_URL}/chats/${params.phoneNumber}`,
        {
          headers: {
            Authorization: await getToken(),
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch chats');
      }

      const data = (await response.json()) as Chat[];
      return Array.isArray(data) ? data : [];
    },
  });
};
