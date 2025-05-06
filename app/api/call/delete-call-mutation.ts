import { useMutation } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';
import { getToken } from '@/api/axios';
import { fetchWithAuth, queryClient } from '@/api';

interface DeleteCallPayload {
  phoneNumber: string;
  callHistoryLogIds: string[];
}

interface DeleteResponse {
  acknowledged: boolean;
  modifiedCount: number;
  upsertedId: string | null;
  upsertedCount: number;
  matchedCount: number;
}

export const deleteCallLog = async (
  payload: DeleteCallPayload
): Promise<DeleteResponse> => {
  const response = await fetchWithAuth(`${API_URL}/callHistory/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: await getToken(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to delete call log');
  }

  queryClient.invalidateQueries({
    queryKey: ['callHistory', payload.phoneNumber],
  });

  return await response.json();
};

export const useDeleteCallMutation = () => {
  return useMutation({
    mutationFn: deleteCallLog,
  });
};
