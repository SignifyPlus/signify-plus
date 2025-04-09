import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';

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
  console.log('Getting contacts for ', params.phoneNumber);
  const { isPending, error, data } = useQuery({
    queryKey: contactsQueryKey(params),
    queryFn: async () => {
      if (!params.phoneNumber) return [];
      const response = await fetch(`${API_URL}/contacts/${params.phoneNumber}`);
      return (await response.json()) as UserContact[];
    },
  });

  return { isPending, error, data };
};
