import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';

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
      const response = await fetch(
        `${API_URL}/userAuthentication/${params.phoneNumber}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch user verification');
      }

      return (await response.json()) as UserVerification;
    },
  });
};
