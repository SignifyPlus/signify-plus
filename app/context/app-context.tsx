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
import { sanitizePhoneNumber } from '@/constants/utils';
import { Contact } from 'react-native-contacts/type';
import { Alert } from 'react-native';

type CallType = {
  type: 'video' | 'voice';
  meetingId: string;
  caller: string;
  callee: string;
};

type AppContextType = {
  phoneNumber?: string;
  setPhoneNumber: (phoneNumber: string) => void;
  emitMessage: (message: string) => void;
  isConnected: boolean;
  call: CallType | null;
  declineCall: () => void;
  sendMessage: (
    message: string,
    targetPhoneNumbers: string[],
    chatId: string
  ) => void;
  user: User | undefined;
  setUser: (user: User) => void;
  chatsSearchQuery: string;
  setChatsSearchQuery: (query: string) => void;
  incomingCallUser: Contact | string | undefined;
  callingUser: string | undefined;
  callUser: (type: 'voice' | 'video', targetPhoneNumber: string) => void;
};

export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProviderInner: FC<{ children: ReactNode }> = ({ children }) => {
  const [chatsSearchQuery, setChatsSearchQuery] = useState('');
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const { contacts } = useUpdateContacts({ phoneNumber });
  const [call, setCall] = useState<CallType | null>(null);
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
    (meetingId: string, targetPhoneNumber: string, isVoiceCall: boolean) => {
      const socket = socketRef.current;
      if (socket && phoneNumber) {
        socket.connect();
        const sanitizedTargetPhone = sanitizePhoneNumber(targetPhoneNumber);
        socket.emit('meeting-id', {
          userPhoneNumber: sanitizePhoneNumber(phoneNumber),
          meetingId,
          targetPhoneNumbers: [sanitizedTargetPhone],
          isVoiceCall,
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

  const callUser = useCallback(
    async (type: 'voice' | 'video', targetPhoneNumber: string) => {
      if (!phoneNumber) return;
      const sanitizedTargetPhone = sanitizePhoneNumber(targetPhoneNumber);
      const meetingId = await createMeeting();
      setCall({
        type: type,
        meetingId: meetingId,
        caller: phoneNumber,
        callee: targetPhoneNumber,
      });
      sendMeetingId(meetingId, sanitizedTargetPhone, type === 'voice');
      switch (type) {
        case 'video':
          router.push(`/video-call?meetingId=${meetingId}`);
          await sendMeetingIdToPython(meetingId);
          break;
        case 'voice':
          router.push(`/voice-call?meetingId=${meetingId}`);
          break;
        default:
          throw new Error('Invalid call type');
      }
    },
    [phoneNumber, router, sendMeetingId, sendMeetingIdToPython]
  );

  const declineCall = useCallback(() => {
    const socket = socketRef.current;
    if (socket && isConnected && call && phoneNumber) {
      const targetPhoneNumbers = [
        sanitizePhoneNumber(
          call?.callee === phoneNumber ? call.caller : call.callee
        ),
      ];
      socket.emit('meeting-id-decline', {
        userPhoneNumber: sanitizePhoneNumber(phoneNumber),
        meetingId: call?.meetingId,
        targetPhoneNumbers: targetPhoneNumbers,
      });
    }
    setCall(null);
  }, [call, isConnected, phoneNumber]);

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

    // socket.on('message', (data) => {
    //   console.log(
    //     `Received message from ${data.senderPhoneNumber}: ${data.message}`
    //   );
    // });

    socket.on('meeting-id-offer', (data) => {
      // Handle incoming meeting ID offer

      const callType = data.isVoiceCall ? 'voice' : 'video';
      setCall({
        type: callType,
        meetingId: data.meetingId,
        caller: data.senderPhoneNumber,
        callee: phoneNumber,
      });
      router.push(`/incoming-call?callType=${callType}`);
    });

    socket.on('call-declined', (_data) => {
      setCall(null);
      router.dismiss();
    });

    socket.on('meeting-id-failed', (data) => {
      console.log(data);
      if (data.message === 'USER_NOT_FOUND') {
        Alert.alert('NO_USER_FOUND', 'Call failed because user was not found');
      }

      router.dismiss();
      setCall(null);
    });

    socket.on('user-disconnected-from-meeting', () => {
      setCall(null);
      router.dismiss();
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
  }, [phoneNumber, router]);

  const temp = call?.callee === phoneNumber ? call?.caller : call?.callee;
  const incomingCallUser =
    contacts.find((contact) => {
      return contact.phoneNumbers.some((phone) => {
        return phone.number === temp;
      });
    }) || temp;

  const contextValue = useMemo(
    () => ({
      phoneNumber,
      setPhoneNumber,
      callUser,
      emitMessage,
      isConnected,
      call: call,
      declineCall,
      sendMessage,
      setUser,
      user,
      chatsSearchQuery,
      setChatsSearchQuery,
      incomingCallUser,
      callingUser: call?.caller,
    }),
    [
      phoneNumber,
      callUser,
      emitMessage,
      isConnected,
      call,
      declineCall,
      sendMessage,
      user,
      chatsSearchQuery,
      incomingCallUser,
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
