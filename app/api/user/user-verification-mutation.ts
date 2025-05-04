import { useMutation } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';
import { getToken } from '@/api/axios';
import { fetchWithAuth } from '..';

interface VerifyUserParams {
  phoneNumber: string;
}

export interface UserVerification {
  _id: string;
  userId: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const useUserVerificationMutation = () => {
  return useMutation({
    mutationFn: async (params: VerifyUserParams): Promise<UserVerification> => {
      const response = await fetchWithAuth(
        `${API_URL}/userAuthentication/${params.phoneNumber}`,
        {
          headers: {
            Authorization: await getToken(),
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to verify user');
      }

      return await response.json();
    },
  });
};
