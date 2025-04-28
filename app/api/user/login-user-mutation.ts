import { useMutation } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';

export interface User {
  _id: string;
  __v: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  name: string;
  password: string;
  phoneNumber: string;
  profilePicture?: string;
  profileStatus?: string;
  userAuthenticationRecord: {
    isVerified: boolean;
  };
}
interface LoginPayload {
  phoneNumber: string;
  password: string;
}

export const loginUser = async ({
  phoneNumber,
  password,
}: LoginPayload): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/users/phone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed. Please check your credentials.');
    }
    const rawData = await response.json();

    return {
      ...rawData,
    };
  } catch (error) {
    throw new Error('Login failed. Please check your credentials.');
  }
};

export const useLoginUserMutation = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};
