import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';
import { contactsQueryKey } from '@/api/contacts-query';
import { getToken } from './axios';
import { fetchWithAuth } from '.';

export interface PostContactsParams {
  userPhoneNumber: string;
  contacts: string[];
}

export const usePostContactsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: PostContactsParams) => {
      const response = await fetchWithAuth(`${API_URL}/contacts/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: await getToken(),
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to add contacts');
      }

      const data = await response.json();
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: contactsQueryKey({ phoneNumber: variables.userPhoneNumber }),
      });
    },
  });
};
