import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useMeeting } from '@videosdk.live/react-native-sdk';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export const ControlsContainer: React.FC = () => {
  const { leave, toggleWebcam, toggleMic, localParticipant } = useMeeting();
  const router = useRouter();

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

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 24,
        left: 24,
        right: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
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
          // await clearMeetingIdOnServer();
          leave();
          router.replace('/(tabs)/chats');
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
