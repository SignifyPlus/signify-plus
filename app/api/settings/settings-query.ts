import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';
import { getToken } from '../axios';
import { fetchWithAuth } from '..';

export type UserSettings = {
  _id: string;
  userId: {
    _id: string;
    name: string;
    phoneNumber: string;
  };
  theme: string;
  autoDownload: boolean;
  notificationEnabled: boolean;
  aslTranslationLanguage: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export const settingsQueryKey = (params: { phoneNumber?: string }) => [
  'settings',
  params.phoneNumber,
];

export const useSettingsQuery = (params: { phoneNumber?: string }) => {
  return useQuery({
    queryKey: settingsQueryKey(params),
    enabled: !!params.phoneNumber,
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${API_URL}/settings/${params.phoneNumber}`,
        {
          headers: {
            Authorization: await getToken(),
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No settings found');
      }

      return data[0] as UserSettings;
    },
  });
};
