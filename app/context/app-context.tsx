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
import { createMeeting } from '@/api';

type IncomingCallType = {
  meetingId: string;
  incomingCallNumber: string;
};

type AppContextType = {
  phoneNumber?: string;
  setPhoneNumber: (phoneNumber: string) => void;
  videoCallUser: (targetPhoneNumber: string) => void;
  emitMessage: (message: string) => void;
  isConnected: boolean;
  incomingCall: IncomingCallType | null;
  declineVideoCall: () => void;
};

export const AppContext = createContext<AppContextType | null>(null);

const sanitizePhoneNumber = (phoneNumber: string): string => {
  return phoneNumber.replace(/\s+/g, '');
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const [incomingCall, setIncomingCall] = useState<IncomingCallType | null>(
    null
  );
  const router = useRouter();

  const emitMessage = useCallback(
    (message: string) => {
      const socket = socketRef.current;
      if (socket && isConnected) {
        socket.emit('message', message);
        console.log(`Sent message: ${message}`);
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
        console.log(
          `Sending meeting ID to target user: ${sanitizedTargetPhone}`
        );
        socket.emit('meeting-id', {
          userPhoneNumber: sanitizePhoneNumber(phoneNumber),
          meetingId,
          targetPhoneNumbers: [sanitizedTargetPhone],
        });
      }
    },
    [phoneNumber]
  );

  const videoCallUser = useCallback(
    async (targetPhoneNumber: string) => {
      if (!phoneNumber) {
        console.error('Cannot start a call without a registered phone number.');
        return;
      }
      const sanitizedTargetPhone = sanitizePhoneNumber(targetPhoneNumber);
      console.log(`Calling user with phone number: ${sanitizedTargetPhone}`);
      const meetingId = await createMeeting();
      sendMeetingId(meetingId, sanitizedTargetPhone);
      router.push(`/video-call?meetingId=${meetingId}`);
    },
    [phoneNumber, router, sendMeetingId]
  );

  const declineVideoCall = useCallback(() => {
    const socket = socketRef.current;
    if (socket && isConnected && incomingCall && phoneNumber) {
      socket.emit('meeting-id-decline', {
        userPhoneNumber: sanitizePhoneNumber(phoneNumber),
        meetingId: incomingCall?.meetingId,
        targetPhoneNumber: sanitizePhoneNumber(
          incomingCall?.incomingCallNumber
        ),
      });
    }
    setIncomingCall(null);
  }, [incomingCall, isConnected, phoneNumber]);

  useEffect(() => {
    if (!phoneNumber) return;

    const sanitizedPhone = sanitizePhoneNumber(phoneNumber);
    const socket = io(API_URL);
    console.log('connect callled');
    socket.connect();
    socketRef.current = socket;

    console.log(
      'Connecting to WebSocket server',
      sanitizedPhone,
      socket.connected
    );

    socket.on('connect', () => {
      console.log('Connected to WebSocket server', sanitizedPhone);
      socket.emit('socket-registration', { userPhoneNumber: sanitizedPhone });
      setIsConnected(true);
    });

    socket.on('disconnect', (data) => {
      console.log('Disconnected from WebSocket server', data);
      setIsConnected(false);
    });

    socket.on('meeting-id-offer', (data) => {
      console.log('Received meeting ID offer:', data);
      // Handle incoming meeting ID offer
      setIncomingCall({
        meetingId: data.meetingId,
        incomingCallNumber: data.sendPhoneNumber,
      });
    });

    socket.on('meeting-id-failed', (data) => {
      console.error('Meeting ID offer failed:', data.message);
    });

    socket.on('message', (msg) => {
      console.log('Received message:', msg);
    });

    return () => {
      console.log('Cleaning up WebSocket connection');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [phoneNumber]);

  useEffect(() => {
    if (incomingCall) {
      router.push('/incoming-call');
    }
  }, [incomingCall, router]);

  const contextValue = useMemo(
    () => ({
      phoneNumber,
      setPhoneNumber,
      videoCallUser,
      emitMessage,
      isConnected,
      incomingCall,
      declineVideoCall,
    }),
    [
      phoneNumber,
      videoCallUser,
      emitMessage,
      isConnected,
      incomingCall,
      declineVideoCall,
    ]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
