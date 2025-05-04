import { useMutation } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';

interface GetOtpResponse {
  valid: boolean;
  status: string;
}

export const useGetOtpMutation = () => {
  return useMutation({
    mutationFn: async (phoneNumber: string): Promise<GetOtpResponse> => {
      const response = await fetch(`${API_URL}/twilio/getOtp/${phoneNumber}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to get OTP');
      }

      return (await response.json()) as GetOtpResponse;
    },
  });
};
