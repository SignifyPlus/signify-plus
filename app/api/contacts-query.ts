import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/constants/Config";

export interface Contact {
  id: string;
  name: string;
  profilePicture: string;
  status: string;
}

export const contactsQueryKey = (params: { phoneNumber?: string }) => [
  "contacts",
  params.phoneNumber,
];

export const useContactsQuery = (params: { phoneNumber?: string }) => {
  const { isPending, error, data } = useQuery({
    queryKey: contactsQueryKey(params),
    queryFn: async () => {
      if (!params.phoneNumber) return [];
      const response = await fetch(`${API_URL}/contacts/${params.phoneNumber}`);
      const data = await response.json();
      return (data.contacts ?? []) as Contact[];
    },
  });

  return { isPending, error, data };
};
