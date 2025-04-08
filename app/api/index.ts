import { QueryClient } from '@tanstack/react-query';

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
  console.log('room id', roomId);
  return roomId;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const signUpWithPhoneNumber = async (
  phoneNumber: string
): Promise<void> => {
  // await sleep(300); // Simulates the network delay
  console.log(`SignUp created for: ${phoneNumber}`);
};

export const preparePhoneVerification = async (): Promise<void> => {
  // await sleep(300); // Simulates the network delay
  console.log('Phone number verification prepared.');
};

export const createSignInSession = async (
  identifier: string
): Promise<{ supportedFirstFactors: any[] }> => {
  // await sleep(300); // Simulates the network delay
  console.log(`SignIn created for: ${identifier}`);
  return {
    supportedFirstFactors: [{ strategy: 'phone_code', phoneNumberId: '12345' }],
  };
};

export const prepareFirstFactorVerification = async (options: {
  strategy: string;
  phoneNumberId: string;
}): Promise<void> => {
  // await sleep(300); // Simulates the network delay
  console.log('First factor prepared for:', options.phoneNumberId);
};

export const attemptPhoneNumberVerificationForSignUp = async (
  code: string
): Promise<void> => {
  await sleep(300);
  console.log(
    `Attempted phone number verification for sign-up with code: ${code}`
  );
};

export const activateUserSessionAfterSignUp = async (): Promise<void> => {
  await sleep(300);
  console.log(`Activated user session after sign-up.`);
};

export const attemptFirstFactorVerificationForSignIn = async (
  code: string
): Promise<void> => {
  await sleep(300);
  console.log(
    `Attempted first factor verification for sign-in with code: ${code}`
  );
};

export const activateUserSessionAfterSignIn = async (): Promise<void> => {
  await sleep(300);
  console.log(`Activated user session after sign-in.`);
};

export const resendSignUpVerificationCode = async (
  phone: string
): Promise<void> => {
  await sleep(300);
  console.log(`Resent sign-up verification code to phone: ${phone}`);
};

export const resendSignInVerificationCode = async (
  phone: string
): Promise<void> => {
  await sleep(300);
  console.log(`Resent sign-in verification code to phone: ${phone}`);
};
