import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useAppContext } from '@/context/app-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const AcceptCallScreen = () => {
  const { incomingCall, declineVideoCall, incomingCallUser } = useAppContext();

  const { callType } = useLocalSearchParams<{
    callType: 'video' | 'voice';
  }>();

  const router = useRouter();

  const onAccept = () => {
    if (!incomingCall) {
      return;
    }
    if (callType === 'voice') {
      router.push(`/voice-call?meetingId=${incomingCall.meetingId}`);
    } else {
      router.push(`/video-call?meetingId=${incomingCall.meetingId}`);
    }
  };

  const onDecline = () => {
    declineVideoCall();
    router.replace('/(tabs)/chats');
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#1a1a1a',
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 50,
        }}
      >
        <View
          style={{
            alignItems: 'center',
            marginTop: 50,
          }}
        >
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: '#404040',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 40,
                color: 'white',
              }}
            >
              {(
                incomingCallUser?.displayName ??
                incomingCall?.incomingCallNumber ??
                'Unknown Caller'
              )
                .charAt(0)
                .toUpperCase()}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 10,
            }}
          >
            {incomingCallUser?.displayName ??
              incomingCall?.incomingCallNumber ??
              'Unknown Caller'}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: '#cccccc',
            }}
          >
            Incoming call...
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            width: width,
            paddingHorizontal: 30,
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={onDecline}
            style={{
              width: 70,
              height: 70,
              borderRadius: 35,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#FF4444',
              ...(Platform.OS === 'ios'
                ? {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                  }
                : {
                    elevation: 5,
                  }),
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold',
              }}
            >
              Decline
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onAccept}
            style={{
              width: 70,
              height: 70,
              borderRadius: 35,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#4CAF50',
              ...(Platform.OS === 'ios'
                ? {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                  }
                : {
                    elevation: 5,
                  }),
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold',
              }}
            >
              Accept
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AcceptCallScreen;
