import { getAsyncStorageValue } from '@/context/async-storage';
import { User } from './user/login-user-mutation';

export const getToken = async () => {
  const user = await getAsyncStorageValue('user');
  if (!user) throw new Error('No user found');
  const token = (JSON.parse(user) as User).accessToken;
  if (token) return `Bearer ${token}`;
  throw new Error('No token found');
};
