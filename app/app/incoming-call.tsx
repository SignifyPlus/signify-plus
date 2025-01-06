import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useAppContext } from '@/context/app-context';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const AcceptCallScreen = () => {
  const { incomingCall, declineVideoCall } = useAppContext();

  const router = useRouter();

  const onAccept = () => {
    if (!incomingCall) {
      console.log('No incoming call found');
      return;
    }
    console.log('Call accepted');
    router.push(`/video-call?meetingId=${incomingCall.meetingId}`);
  };

  const onDecline = () => {
    console.log('Call declined');
    declineVideoCall();
    router.replace('/(tabs)/chats');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.callerInfo}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{'A'.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.callerName}>
            {incomingCall?.incomingCallNumber ?? 'Unknown Caller'}
          </Text>
          <Text style={styles.callStatus}>Incoming call...</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.declineButton]}
            onPress={onDecline}
          >
            <Text style={styles.buttonText}>Decline</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={onAccept}
          >
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
  },
  callerInfo: {
    alignItems: 'center',
    marginTop: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#404040',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarText: {
    fontSize: 40,
    color: 'white',
  },
  callerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  callStatus: {
    fontSize: 16,
    color: '#cccccc',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: width,
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  declineButton: {
    backgroundColor: '#FF4444',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AcceptCallScreen;
