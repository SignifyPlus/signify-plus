import { useMutation } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';
import { fetchWithAuth, queryClient } from '@/api';
import { getToken } from '@/api/axios';

interface UpdateVerificationPayload {
  phoneNumber: string;
  isVerified: boolean;
}

interface VerificationResponse {
  _id: string;
  userId: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const updateUserVerification = async ({
  phoneNumber,
  isVerified,
}: UpdateVerificationPayload): Promise<VerificationResponse> => {
  const response = await fetchWithAuth(`${API_URL}/userAuthentication/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: await getToken(),
    },
    body: JSON.stringify({ phoneNumber, isVerified }),
  });

  if (!response.ok) {
    throw new Error('Failed to update user verification');
  }

  return await response.json();
};

export const useUpdateUserVerificationMutation = () => {
  return useMutation({
    mutationFn: updateUserVerification,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['userVerification'],
      });
    },
  });
};
