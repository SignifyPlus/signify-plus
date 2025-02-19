import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';
import { contactsQueryKey } from '@/api/contacts-query';

export interface PostContactsParams {
  userPhoneNumber: string;
  contacts: string[];
}

export const usePostContactsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: PostContactsParams) => {
      console.log('Posting contacts', params);
      const response = await fetch(`${API_URL}/contacts/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        console.error(response);
        throw new Error('Failed to add contacts');
      }

      const data = await response.json();
      console.log('Contacts added', data);
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: contactsQueryKey({ phoneNumber: variables.userPhoneNumber }),
      });
    },
  });
};
