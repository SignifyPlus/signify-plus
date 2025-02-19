import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/constants/Config";
import { contactsQueryKey } from "@/api/contacts-query";

export interface PostContactsParams {
  userPhone: string;
  contacts: string[];
}

export const usePostContactsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: PostContactsParams) => {
      const response = await fetch(`${API_URL}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error("Failed to add contacts");
      }

      return response.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: contactsQueryKey({ phoneNumber: variables.userPhone }),
      });
    },
  });
};
