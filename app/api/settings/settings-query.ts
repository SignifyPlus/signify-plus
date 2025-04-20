import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';

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
      const response = await fetch(`${API_URL}/settings/${params.phoneNumber}`);
      const body = await response.json();

      if (!Array.isArray(body) || body.length === 0) {
        throw new Error('No settings found');
      }

      return body[0] as UserSettings;
    },
  });
};
