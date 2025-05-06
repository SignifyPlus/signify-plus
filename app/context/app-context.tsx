import {
  createContext,
  type FC,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,} from "react";
  import io, { Socket } from "socket.io-client";
  import { API_URL, NGROK_URL } from "@/constants/Config";
  import { useRouter } from "expo-router";
  import { createMeeting, queryClient } from "@/api";
  import { QueryClientProvider } from "@tanstack/react-query";
  import { useUpdateContacts } from "@/context/use-update-contacts";
  import { useContactsQuery } from "@/api/contacts-query";
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
  callSearchQuery: string;
  setCallSearchQuery: (query: string) => void;
  reset: () => void;
  sendMeetingAccepted: () => void;
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
  const [callSearchQuery, setCallSearchQuery] = useState('');
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const { contacts } = useUpdateContacts({ phoneNumber });
  const [call, setCall] = useState<CallType | null>(null);
  const [targetPhoneNumbers, setTargetPhoneNumbers] = useState<string[]>([]);
  const router = useRouter();
  const [user, setUser] = useState<User | undefined>();

  const reset = useCallback(() => {
    setPhoneNumber(undefined);
    setIsConnected(false);
    setCall(null);
    setUser(undefined);
    setChatsSearchQuery('');
    setCallSearchQuery('');
  }, []);

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

  // Modified sendMeetingIdToPython function with error handling
  const sendMeetingIdToPython = useCallback(
    async (meetingId: string) => {
      try {
        const response = await fetch(NGROK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ meetingId }),
        });
        
        // Check if the response is successful and content-type is application/json
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const result = await response.json();
          console.log('Meeting ID sent to Python:', result);
        } else {
          // Non-JSON response, likely HTML error page
          console.log('ML server returned non-JSON response (likely offline)');
          // Continue with regular call without error
        }
      } catch (error) {
        // Log the error but don't throw it, allowing regular call to proceed
        console.error('ML connection failed (non-critical):', error);
        // Continue with regular call without error
      }
    },
    []
  );

  const sendMeetingId = useCallback(
    (meetingId: string, targetPhoneNumber: string, isVoiceCall: boolean) => {
      const socket = socketRef.current;
      if (socket && phoneNumber) {
        const sanitizedTargetPhone = sanitizePhoneNumber(targetPhoneNumber);
        const allTargets = [sanitizedTargetPhone];
        setTargetPhoneNumbers(allTargets);

        socket.emit('meeting-id', {
          userPhoneNumber: sanitizePhoneNumber(phoneNumber),
          callinitiator: sanitizePhoneNumber(phoneNumber),
          meetingId,
          targetPhoneNumbers: allTargets,
          isVoiceCall,
          isOnCall: true,
        });
      }
    },
    [phoneNumber]
  );

  const sendMessage = useCallback(
    (message: string, targetPhoneNumbers: string[], chatId: string) => {
      const socket = socketRef.current;
      if (socket && isConnected && phoneNumber) {
        const sanitizedTargetPhones =
          targetPhoneNumbers.map(sanitizePhoneNumber);
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

  
  const callUser = useCallback(
    async (type: 'voice' | 'video', targetPhoneNumber: string) => {
      if (!phoneNumber) return;
      const meetingId = await createMeeting();
      setCall({
        type,
        meetingId,
        caller: phoneNumber,
        callee: targetPhoneNumber,
      });
      sendMeetingId(meetingId, targetPhoneNumber, type === 'voice');

      if (type === 'video') {
        router.push(`/video-call?meetingId=${meetingId}`);
        // Try to send to ML server but continue even if it fails
        try {
          await sendMeetingIdToPython(meetingId);
        } catch (error) {
          // Silently continue with regular call if ML server is unavailable
          console.log('Continuing with regular call without ML features');
        }
      } else {
        router.push(`/voice-call?meetingId=${meetingId}`);
      }
    },
    [phoneNumber, router, sendMeetingId, sendMeetingIdToPython]
  );

  const sendMeetingAccepted = useCallback(() => {
    if (!socketRef.current || !call) return;
    socketRef.current.emit('meeting-accepted', {
      userPhoneNumber: phoneNumber,
      meetingId: call.meetingId,
      isVoiceCall: call.type === 'voice',
      isOnCall: true,
      callinitiator: call.caller,
      targetPhoneNumbers,
    });
  }, [call, phoneNumber, targetPhoneNumbers]);

  const declineCall = useCallback(() => {
    const socket = socketRef.current;
    if (socket && isConnected && call && phoneNumber) {
      const target = sanitizePhoneNumber(
        call.callee === phoneNumber ? call.caller : call.callee
      );
      socket.emit('meeting-id-decline', {
        userPhoneNumber: sanitizePhoneNumber(phoneNumber),
        meetingId: call.meetingId,
        isVoiceCall: call.type === 'voice',
        isOnCall: false,
        callinitiator: call.caller,
        targetPhoneNumbers: [target],
      });
    }
    setCall(null);
  }, [call, isConnected, phoneNumber]);

  useEffect(() => {
    if (!phoneNumber) return;

    const socket = io(API_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('socket-registration', {
        userPhoneNumber: sanitizePhoneNumber(phoneNumber),
      });
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('meeting-id-offer', (data) => {
      const callType = data.isVoiceCall ? 'voice' : 'video';
      setCall({
        type: callType,
        meetingId: data.meetingId,
        caller: data.senderPhoneNumber,
        callee: phoneNumber,
      });
      setTargetPhoneNumbers(data.targetPhoneNumbers || []);
      router.push(`/incoming-call?callType=${callType}`);
    });

    socket.on('call-declined', () => {
      setCall(null);
      router.dismiss();
    });

    socket.on('meeting-id-failed', (data) => {
      setCall(null);
      router.dismiss();
      if (data.message === 'NO_USER_FOUND') {
        setTimeout(() => {
          Alert.alert(
            'User not found',
            'Call failed because user was not found'
          );
        }, 300);
      }
    });

    socket.on('user-disconnected-from-meeting', () => {
      setCall(null);
      router.dismiss();
    });

    socket.on('message', async (msg) => {
      if (msg.chatId) {
        await queryClient.invalidateQueries({ queryKey: ['chats'] });
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [phoneNumber, router]);

  const temp = call?.callee === phoneNumber ? call?.caller : call?.callee;
  const incomingCallUser =
    contacts.find((contact) =>
      contact.phoneNumbers.some((phone) => phone.number === temp)
    ) || temp;

  const contextValue = useMemo(
    () => ({
      phoneNumber,
      setPhoneNumber,
      callUser,
      emitMessage,
      isConnected,
      call,
      declineCall,
      sendMessage,
      setUser,
      user,
      chatsSearchQuery,
      setChatsSearchQuery,
      callSearchQuery,
      setCallSearchQuery,
      incomingCallUser,
      callingUser: call?.caller,
      reset,
      sendMeetingAccepted,
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
      callSearchQuery,
      incomingCallUser,
      reset,
      sendMeetingAccepted,
    ]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <AppProviderInner>{children}</AppProviderInner>
  </QueryClientProvider>
);
