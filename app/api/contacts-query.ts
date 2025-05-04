import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';
import { getToken } from './axios';
import { fetchWithAuth } from '.';

export interface Contact {
  id: string;
  name: string;
  profilePicture: string;
  status: string;
}

export type UserContact = {
  _id: string;
  userId: string;
  contactUserId: {
    _id: string;
    name: string;
    phoneNumber: string;
    profilePicture: string | null;
  };
  status: boolean;
  createdAt: string;
  __v: number;
};

export const contactsQueryKey = (params: { phoneNumber?: string }) => [
  'contacts',
  params.phoneNumber,
];

export const useContactsQuery = (params: { phoneNumber?: string }) => {
  return useQuery({
    refetchInterval: 500,
    queryKey: contactsQueryKey(params),
    queryFn: async () => {
      if (!params.phoneNumber) return [];
      const response = await fetchWithAuth(
        `${API_URL}/contacts/${params.phoneNumber}`,
        {
          headers: {
            Authorization: await getToken(),
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      return (await response.json()) as UserContact[];
    },
  });
};
