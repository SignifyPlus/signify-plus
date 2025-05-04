import { useMutation } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';
import { getToken } from '../axios';
import { fetchWithAuth } from '..';

interface PinChatPayload {
  userPhoneNumber: string;
  chatId: string;
  isPinned: boolean;
}

interface PinChatResponse {
  message: string;
  chat: {
    _id: string;
    mainUserId: string;
    participants: string[];
    isPinned: boolean;
    pinnedBy: string[];
    lastActivity: string;
    isDeleted: boolean;
    createdAt: string;
    __v: number;
    isDeletedBy: string;
  };
}

export const pinChat = async (
  payload: PinChatPayload
): Promise<PinChatResponse> => {
  const response = await fetchWithAuth(`${API_URL}/chats/pin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: await getToken(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to pin chat');
  }

  return await response.json();
};

export const usePinChatMutation = () => {
  return useMutation({
    mutationFn: pinChat,
  });
};
