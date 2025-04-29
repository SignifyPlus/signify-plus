import { useMutation } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';

interface AuthenticationData {
  data: {
    _id: string;
    userId: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  exception: null;
}

export interface User {
  _id: string;
  name: string;
  phoneNumber: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  profileStatus: string;
  profilePicture: string;
  authenticationData: AuthenticationData[];
  accessToken: string;
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
    const rawData = (await response.json()) as User;

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
