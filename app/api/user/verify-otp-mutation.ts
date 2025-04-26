import { useMutation } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';

interface VerifyOtpParams {
  phoneNumber: string;
  otpCode: string;
}

interface VerifyOtpResponse {
  valid: boolean;
  status: string;
}

export const useVerifyOtpMutation = () => {
  return useMutation({
    mutationFn: async (params: VerifyOtpParams): Promise<VerifyOtpResponse> => {
      const response = await fetch(`${API_URL}/twilio/verifyOtp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to verify OTP');
      }

      return (await response.json()) as VerifyOtpResponse;
    },
  });
};
