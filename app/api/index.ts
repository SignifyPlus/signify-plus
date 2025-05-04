import { QueryClient } from '@tanstack/react-query';
import { DevSettings } from 'react-native';
import { setAsyncStorageValue } from '@/context/async-storage';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // retry: 5,
    },
    mutations: {
      // retry: 5,
    },
  },
});

export const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIyN2ZhZDRjMy0xM2ZiLTQ1ZGQtYjBkOS1mODEzYWUxNmU2ZjIiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTczNDY0ODU1OSwiZXhwIjoxODkyNDM2NTU5fQ.Y3bEl5_ffScQJroMT_ihsKs0W0U45bS0w9481rWwl4c';

export const createMeeting = async () => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: 'POST',
    headers: {
      authorization: `${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });
  const { roomId } = await res.json();
  return roomId;
};

export const signUpWithPhoneNumber = async (
  _phoneNumber: string
): Promise<void> => {
  // await sleep(300); // Simulates the network delay
};

export const preparePhoneVerification = async (): Promise<void> => {
  // await sleep(300); // Simulates the network delay
};

export const createSignInSession = async (
  _identifier: string
): Promise<{ supportedFirstFactors: any[] }> => {
  // await sleep(300); // Simulates the network delay
  return {
    supportedFirstFactors: [{ strategy: 'phone_code', phoneNumberId: '12345' }],
  };
};

export const prepareFirstFactorVerification = async (_options: {
  strategy: string;
  phoneNumberId: string;
}): Promise<void> => {
  // await sleep(300); // Simulates the network delay
};

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);

  if (response.status === 401) {
    await setAsyncStorageValue('user', '');
    DevSettings.reload();
    throw new Error('Unauthorized');
  }

  return response;
}
