import { useMutation } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';

interface AuthenticationData {
  _id: string;
  userId: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  refreshToken: string;
  __v: number;
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
  userAuthenticationRecord: AuthenticationData;
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
  const response = await fetch(`${API_URL}/auth/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phoneNumber, password }),
  });

  if (!response.ok) {
    throw new Error('Failed to login');
  }

  const data = await response.json();

  return data as User;
};

export const useLoginUserMutation = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};
