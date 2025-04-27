import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';
import { settingsQueryKey } from './settings-query';
import { UserSettings } from './settings-query';

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
      const response = await fetch(`${API_URL}/settings/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      const data = await response.json();
      return data;
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
