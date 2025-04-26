import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useMeeting } from '@videosdk.live/react-native-sdk';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '@/context/app-context';

export const ControlsContainer = ({
  hideVideo = false,
}: {
  hideVideo?: boolean;
}) => {
  const { leave, toggleWebcam, toggleMic, localParticipant } = useMeeting();
  const router = useRouter();
  const { declineCall } = useAppContext();

  const [micOn, setMicOn] = useState<boolean>(false);
  const [webcamOn, setWebcamOn] = useState<boolean>(false);

  useEffect(() => {
    if (localParticipant) {
      setMicOn(localParticipant.micOn);
      setWebcamOn(localParticipant.webcamOn);
    }
  }, [localParticipant]);

  const handleToggleMic = () => {
    setMicOn((prev) => !prev);
    toggleMic();
  };

  const handleToggleWebcam = () => {
    setWebcamOn((prev) => !prev);
    toggleWebcam();
  };

  const clearMeetingIdOnServer = async () => {
    try {
      const response = await fetch(
        'https://robust-hen-big.ngrok-free.app/meeting-id',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ meetingId: null }),
        }
      );
      if (!response.ok) {
        // console.error('Failed to clear meeting ID on server:', response.status);
      } else {
        // console.log('Meeting ID cleared on server.');
      }
    } catch (error) {
      // console.error('Error clearing meeting ID on server:', error);
    }
  };

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 24,
        left: 24,
        right: 24,
        gap: 32,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(31, 41, 55, 0.75)', // translucent dark background
        borderRadius: 999,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10, // for Android shadow
      }}
    >
      {!hideVideo ? (
        <TouchableOpacity
          onPress={handleToggleWebcam}
          style={{
            backgroundColor: '#1f2937',
            padding: 12,
            borderRadius: 999,
          }}
        >
          <Ionicons
            name={webcamOn ? 'videocam-outline' : 'videocam-off-outline'}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      ) : null}

      <TouchableOpacity
        onPress={handleToggleMic}
        style={{
          backgroundColor: '#1f2937',
          padding: 12,
          borderRadius: 999,
        }}
      >
        <Ionicons
          name={micOn ? 'mic-outline' : 'mic-off-outline'}
          size={24}
          color="#fff"
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={async () => {
          leave();
          declineCall();
          router.replace('/(tabs)/chats');
          await clearMeetingIdOnServer();
        }}
        style={{
          backgroundColor: '#dc2626',
          padding: 12,
          borderRadius: 999,
        }}
      >
        <Ionicons name="call" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};
