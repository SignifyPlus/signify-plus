import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/constants/Config";

type User = {
  _id: string;
  name: string;
  phoneNumber: string;
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
};

export const chatsQueryKey = (params: { phoneNumber?: string }) => [
  "chats",
  params.phoneNumber,
];

export const useChatsQuery = (params: { phoneNumber?: string }) => {
  return useQuery({
    queryKey: chatsQueryKey(params),
    queryFn: async () => {
      if (!params.phoneNumber) return [];
      const response = await fetch(`${API_URL}/chats/${params.phoneNumber}`);
      const body = await response.json();
      if (!Array.isArray(body)) {
        console.error("Invalid response from server:", body);
        return [];
      }
      return (body ?? []) as Chat[];
    },
  });
};
