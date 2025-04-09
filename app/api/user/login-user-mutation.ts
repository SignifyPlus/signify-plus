import { useMutation } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';

export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  createdAt: string;
}

interface LoginPayload {
  phoneNumber: string;
  password: string;
}

export const loginUser = async ({
  phoneNumber,
  password,
}: LoginPayload): Promise<User> => {
  console.log(
    'Logging in with phone number:',
    phoneNumber,
    `${API_URL}/users/phone`
  );
  try {
    const response = await fetch(`${API_URL}/users/phone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, password }),
    });

    console.log(response);

    // if (!response.ok) {
    //   throw new Error('Login failed. Please check your credentials.');
    // }

    const rawData = await response.json();

    return {
      id: rawData._id,
      name: rawData.name,
      phoneNumber: rawData.phoneNumber,
      createdAt: rawData.createdAt,
    };
  } catch (error) {
    console.error('Error logging in:', error);
    throw new Error('Login failed. Please check your credentials.');
  }
};

export const useLoginUserMutation = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};
