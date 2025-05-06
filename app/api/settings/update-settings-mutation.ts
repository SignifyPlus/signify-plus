import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';
import { settingsQueryKey } from './settings-query';
import { UserSettings } from './settings-query';
import { getToken } from '@/api/axios';
import { fetchWithAuth } from '..';

export interface UpdateSettingsParams {
  phoneNumber: string;
  theme?: string;
  autoDownload?: boolean;
  notificationEnabled?: boolean;
  aslTranslationLanguage?: number;
  profilePicture?: string;
}

export const useUpdateSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateSettingsParams) => {
      const response = await fetchWithAuth(`${API_URL}/settings/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: await getToken(),
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      return await response.json();
    },

    onMutate: async (newSettings) => {
      await queryClient.cancelQueries({
        queryKey: settingsQueryKey({ phoneNumber: newSettings.phoneNumber }),
      });

      const queryKey = settingsQueryKey({
        phoneNumber: newSettings.phoneNumber,
      });

      const previousSettings = queryClient.getQueryData<UserSettings>(queryKey);

      queryClient.setQueryData<UserSettings>(
        queryKey,
        (old) =>
          ({
            ...old,
            ...newSettings,
          }) as any
      );

      return { previousSettings, queryKey };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousSettings && context.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousSettings);
      }
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: settingsQueryKey({ phoneNumber: variables.phoneNumber }),
        exact: false,
      });
    },
  });
};
