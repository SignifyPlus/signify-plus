import { useMutation } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';
import { getToken } from '@/api/axios';
import { fetchWithAuth, queryClient } from '@/api';

interface DeleteChatPayload {
  userPhoneNumber: string;
  chatId: string;
}

interface Chat {
  _id: string;
  mainUserId: string;
  participants: string[];
  isPinned: boolean;
  pinnedBy: string[];
  lastActivity: string;
  isDeleted: boolean;
  createdAt: string;
  __v: number;
  isDeletedBy: string[];
}

export const deleteChat = async (payload: DeleteChatPayload): Promise<Chat> => {
  const response = await fetchWithAuth(`${API_URL}/chats/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: await getToken(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to delete chat');
  }

  queryClient.invalidateQueries({
    queryKey: ['chats'],
  });

  return await response.json();
};

export const useDeleteChatMutation = () => {
  return useMutation({
    mutationFn: deleteChat,
  });
};
