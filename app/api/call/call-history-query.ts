import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/constants/Config';
import { getToken } from '../axios';
import { fetchWithAuth } from '..';

export interface CallParticipant {
  _id: string;
  name: string;
  phoneNumber: string;
  type: 'incoming' | 'outgoing';
  profilePicture?: string;
}

export interface CallEntry {
  _id: string;
  initiatorId: {
    _id: string;
    name: string;
    phoneNumber: string;
  };
  deletedBy: string[];
  participants: CallParticipant[];
  callType: string;
  callDurationInSeconds: number;
  callStatus: string;
  initiatedAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const callHistoryQueryKey = (phoneNumber?: string) => [
  'calls',
  'callHistory',
  phoneNumber,
];

export const useCallHistoryQuery = (phoneNumber?: string) => {
  return useQuery({
    refetchInterval: 500,
    queryKey: callHistoryQueryKey(phoneNumber),
    queryFn: async () => {
      if (!phoneNumber) {
        return [];
      }
      const response = await fetchWithAuth(
        `${API_URL}/callHistory/${phoneNumber}`,
        {
          headers: {
            Authorization: await getToken(),
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch call history');
      }
      const data = await response.json();
      return data as CallEntry[];
    },
  });
};
