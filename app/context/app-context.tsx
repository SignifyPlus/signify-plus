import {
  createContext,
  type FC,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import io, { Socket } from 'socket.io-client';
import { API_URL } from '@/constants/Config';
import { useRouter } from 'expo-router';
import { createMeeting, queryClient } from '@/api';
import { QueryClientProvider } from '@tanstack/react-query';
import { useUpdateContacts } from '@/context/use-update-contacts';
import { useContactsQuery } from '@/api/contacts-query';
import { User } from '@/api/user/login-user-mutation';

type IncomingVideoCallType = {
  meetingId: string;
  incomingCallNumber: string;
};

type AppContextType = {
  phoneNumber?: string;
  setPhoneNumber: (phoneNumber: string) => void;
  videoCallUser: (targetPhoneNumber: string) => void;
  voiceCallUser: (targetPhoneNumbers: string[]) => void;
  emitMessage: (message: string) => void;
  isConnected: boolean;
  incomingCall: IncomingVideoCallType | null;
  declineVideoCall: () => void;
  sendMessage: (
    message: string,
    targetPhoneNumbers: string[],
    chatId: string
  ) => void;
  user: User | undefined;
  setUser: (user: User) => void;
};

export const AppContext = createContext<AppContextType | null>(null);

export const sanitizePhoneNumber = (phoneNumber: string): string => {
  return phoneNumber.replace(/[\s\-()]/g, '');
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProviderInner: FC<{ children: ReactNode }> = ({ children }) => {
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const [incomingVideoCall, setIncomingVideoCall] =
    useState<IncomingVideoCallType | null>(null);
  const [incomingVoiceCall, setIncomingVoiceCall] = useState<{
    senderPhoneNumber: string;
  } | null>(null);
  const router = useRouter();
  const [user, setUser] = useState<User | undefined>();
  // means to fetch earlier than required so we can see the list instantly
  useContactsQuery({ phoneNumber });

  const emitMessage = useCallback(
    (message: string) => {
      const socket = socketRef.current;
      if (socket && isConnected) {
        socket.emit('message', message);
      }
    },
    [isConnected]
  );

  const sendMeetingId = useCallback(
    (meetingId: string, targetPhoneNumber: string) => {
      const socket = socketRef.current;
      if (socket && phoneNumber) {
        socket.connect();
        const sanitizedTargetPhone = sanitizePhoneNumber(targetPhoneNumber);
        socket.emit('meeting-id', {
          userPhoneNumber: sanitizePhoneNumber(phoneNumber),
          meetingId,
          targetPhoneNumbers: [sanitizedTargetPhone],
        });
      }
    },
    [phoneNumber]
  );

  const sendMessage = useCallback(
    (message: string, targetPhoneNumbers: string[], chatId: string) => {
      const socket = socketRef.current;
      if (socket && isConnected && phoneNumber) {
        const sanitizedTargetPhones = targetPhoneNumbers.map((phone) =>
          sanitizePhoneNumber(phone)
        );

        socket.emit('message', {
          senderPhoneNumber: sanitizePhoneNumber(phoneNumber),
          message,
          targetPhoneNumbers: sanitizedTargetPhones,
          chatId,
        });
        setTimeout(() => {
          void queryClient.invalidateQueries({ queryKey: ['chats'] });
        }, 100);
      }
    },
    [isConnected, phoneNumber]
  );

  //Function to send meeting ID via HTTP POST
  const sendMeetingIdToPython = useCallback(async (meetingId: string) => {
    try {
      const response = await fetch(
        'https://robust-hen-big.ngrok-free.app/meeting-id',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ meetingId }),
        }
      );
      await response.json();
    } catch (error) {
      //   console.error('Error sending meeting ID to Python server:', error);
    }
  }, []);

  const videoCallUser = useCallback(
    async (targetPhoneNumber: string) => {
      if (!phoneNumber) {
        return;
      }
      const sanitizedTargetPhone = sanitizePhoneNumber(targetPhoneNumber);
      const meetingId = await createMeeting();
      sendMeetingId(meetingId, sanitizedTargetPhone);
      router.push(`/video-call?meetingId=${meetingId}`);
      // Send the new meeting ID to the Python server via HTTP POST
      await sendMeetingIdToPython(meetingId);
    },
    [phoneNumber, router, sendMeetingId, sendMeetingIdToPython]
  );

  const voiceCallUser = useCallback(
    (targetPhoneNumbers: string[]) => {
      const socket = socketRef.current;

      if (!socket || !isConnected || !phoneNumber) return;

      const sanitizedSender = sanitizePhoneNumber(phoneNumber);
      const sanitizedTargets = targetPhoneNumbers.map(sanitizePhoneNumber);

      socket.emit('voice-call-initiated', {
        senderPhoneNumber: sanitizedSender,
        targetPhoneNumbers: sanitizedTargets,
      });
    },
    [isConnected, phoneNumber]
  );

  const declineVideoCall = useCallback(() => {
    const socket = socketRef.current;
    if (socket && isConnected && incomingVideoCall && phoneNumber) {
      socket.emit('meeting-id-decline', {
        userPhoneNumber: sanitizePhoneNumber(phoneNumber),
        meetingId: incomingVideoCall?.meetingId,
        targetPhoneNumber: sanitizePhoneNumber(
          incomingVideoCall?.incomingCallNumber
        ),
      });
    }
    setIncomingVideoCall(null);
  }, [incomingVideoCall, isConnected, phoneNumber]);

  useEffect(() => {
    if (!phoneNumber) return;

    const sanitizedPhone = sanitizePhoneNumber(phoneNumber);
    const socket = io(API_URL);
    socket.connect();
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('socket-registration', { userPhoneNumber: sanitizedPhone });
      setIsConnected(true);
    });

    socket.on('disconnect', (_data) => {
      setIsConnected(false);
    });

    socket.on('incoming-call', (data) => {
      setIncomingVoiceCall({
        senderPhoneNumber: data.senderPhoneNumber,
      });
    });

    // when the caller gets notified whether the call was accepted or declined
    socket.on('incoming-call-resolution', (data) => {
      // data = { targetPhoneNumber: string, accepted: boolean }
      console.log('Voice call was', data.accepted ? 'accepted' : 'declined');
      // optionally: navigate or update UI here
    });

    // socket.on('message', (data) => {
    //   console.log(
    //     `Received message from ${data.senderPhoneNumber}: ${data.message}`
    //   );
    // });

    socket.on('meeting-id-offer', (data) => {
      // Handle incoming meeting ID offer
      setIncomingVideoCall({
        meetingId: data.meetingId,
        incomingCallNumber: data.senderPhoneNumber,
      });
    });

    socket.on('meeting-id-failed', (_data) => {
      // console.error('Meeting ID offer failed:', data.message);
    });

    socket.on('message', async (msg) => {
      if (msg.chatId) {
        await queryClient.invalidateQueries({
          queryKey: ['chats'],
        });
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [phoneNumber]);

  useEffect(() => {
    if (incomingVideoCall) {
      router.push('/incoming-call');
    }
  }, [incomingVideoCall, router]);

  console.log('Incoming voice call data:', incomingVoiceCall);

  const contextValue = useMemo(
    () => ({
      phoneNumber,
      setPhoneNumber,
      videoCallUser,
      voiceCallUser,
      emitMessage,
      isConnected,
      incomingCall: incomingVideoCall,
      declineVideoCall,
      sendMessage,
      setUser,
      user,
    }),
    [
      phoneNumber,
      videoCallUser,
      voiceCallUser,
      emitMessage,
      isConnected,
      incomingVideoCall,
      declineVideoCall,
      sendMessage,
      user,
    ]
  );

  useUpdateContacts({ phoneNumber });

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProviderInner>{children}</AppProviderInner>
    </QueryClientProvider>
  );
};
