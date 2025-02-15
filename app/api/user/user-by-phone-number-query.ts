import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';

export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  profilePicture?: string;
  createdAt: string;
}

export const userQueryKey = (phoneNumber?: string) => ['user', phoneNumber];

export const useUserByPhoneNumberQuery = (phoneNumber?: string) => {
  const { isPending, error, data } = useQuery({
    queryKey: userQueryKey(phoneNumber),
    queryFn: async () => {
      if (!phoneNumber) return null;
      const response = await fetch(`${API_URL}/user/${phoneNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      return (await response.json()) as User;
    },
    enabled: !!phoneNumber,
  });

  return { isPending, error, data };
};
