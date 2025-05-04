import { useMutation } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';
import { getToken } from '@/api/axios';
import { fetchWithAuth } from '..';

interface ArchiveChatPayload {
  userPhoneNumber: string;
  chatId: string;
  isArchived: boolean;
}

interface Chat {
  _id: string;
  mainUserId: string;
  participants: string[];
  isPinned: boolean;
  pinnedBy: string[];
  lastActivity: string;
  isDeleted: boolean;
  deletedBy: string[];
  isArchived: boolean;
  archivedBy: string[];
  createdAt: string;
  __v: number;
}

interface ArchiveChatResponse {
  message: string;
  chat: Chat;
}

export const archiveChat = async (
  payload: ArchiveChatPayload
): Promise<ArchiveChatResponse> => {
  const response = await fetchWithAuth(`${API_URL}/chats/archive`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: await getToken(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to archive chat');
  }

  return await response.json();
};

export const useArchiveChatMutation = () => {
  return useMutation({
    mutationFn: archiveChat,
  });
};
