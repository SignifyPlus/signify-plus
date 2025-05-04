import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';
import { getToken } from '../axios';
import { fetchWithAuth } from '..';

export interface UserVerification {
  _id: string;
  userId: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const userVerificationQueryKey = (params: { phoneNumber?: string }) => [
  'userVerification',
  params.phoneNumber,
];

export const useUserVerificationQuery = (params: { phoneNumber?: string }) => {
  return useQuery({
    queryKey: userVerificationQueryKey(params),
    enabled: !!params.phoneNumber,
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${API_URL}/userAuthentication/${params.phoneNumber}`,
        {
          headers: {
            Authorization: await getToken(),
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch user verification');
      }
      return (await response.json()) as UserVerification;
    },
  });
};
