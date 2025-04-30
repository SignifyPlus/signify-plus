import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  
} from 'react-native';
import {
  MeetingProvider,
  register,
  useMeeting,
  useParticipant,
} from '@videosdk.live/react-native-sdk';
import { NativeModules, NativeEventEmitter } from 'react-native';
const { HandLandmarkerHelper } = NativeModules;
import { createMeeting, token } from '@/api';
import { useLocalSearchParams } from 'expo-router';
import { ParticipantList } from '@/components/ParticipantList';
import { ControlsContainer } from '@/components/ControlsContainer';
import { Ringing } from '@/components/Ringing';
import { useAppContext } from '@/context/app-context';
import { ML_WEBSOCKET_URL } from '@/constants/Config';
const handEmitter = new NativeEventEmitter(HandLandmarkerHelper);

register();

interface JoinScreenProps {
  getMeetingId: () => void;
  setMeetingId: (id: string) => void;
}

const JoinScreen: React.FC<JoinScreenProps> = ({ getMeetingId, setMeetingId }) => {
  const [meetingVal, setMeetingVal] = useState<string>('');
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={getMeetingId} style={styles.createButton}>
        <Text style={styles.buttonText}>Create Meeting</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>---------- OR ----------</Text>
      <TextInput
        value={meetingVal}
        onChangeText={setMeetingVal}
        placeholder={'XXXX-XXXX-XXXX'}
        style={styles.textInput}
      />
      <TouchableOpacity
        style={styles.joinButton}
        onPress={() => setMeetingId(meetingVal)}
      >
        <Text style={styles.buttonText}>Join Meeting</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const MeetingView: React.FC = () => {
  const { participants, localParticipant, join } = useMeeting();
  const { captureImage } = useParticipant(localParticipant?.id || '');
  const { call } = useAppContext();
  const websocketRef = useRef<WebSocket | null>(null);
  const eventEmitter = new NativeEventEmitter(HandLandmarkerHelper);
  const participantsArrId = Array.from(participants.keys());
  const joinedRef = useRef(false);

  // Open WebSocket to ML inference service
  useEffect(() => {
    const ws = new WebSocket(ML_WEBSOCKET_URL);
    ws.onopen = () => console.log('Connected to inference WS');
    ws.onerror = e => console.warn('Inference WS error', e);
    websocketRef.current = ws;
    return () => ws.close();
  }, []);

  // Subscribe to live-stream feature events
  useEffect(() => {
    const sub = eventEmitter.addListener('onHandFeatures', (featuresJson: string) => {
      const features: number[] = JSON.parse(featuresJson);
      websocketRef.current?.send(JSON.stringify({ type: 'features', data: features }));
    });
    const errSub = eventEmitter.addListener('onHandFeaturesError', (msg: string) => {
      console.warn('HandLandmarker error:', msg);
    });
    return () => {
      sub.remove();
      errSub.remove();
    };
  }, []);

  // Capture frames and push to live-stream detector
  useEffect(() => {
    let handle: NodeJS.Timeout;
    if (localParticipant?.id && captureImage) {
      handle = setInterval(async () => {
        try {
          const b64frame = await captureImage({ width: 640, height: 480 });
          HandLandmarkerHelper.detectLiveStreamFrame(b64frame);
        } catch (e) {
          console.warn('Frame capture or live-stream detect failed', e);
        }
      }, 50);
    }
    return () => clearInterval(handle);
  }, [localParticipant?.id, captureImage]);

  // Join logic
  useEffect(() => {
    if (joinedRef.current) return;
    if (!localParticipant?.id) {
      joinedRef.current = true;
      setTimeout(() => join(), 200);
    }
  }, [join, localParticipant?.id, participantsArrId]);

  const isRinging = joinedRef.current && participantsArrId.length <= 1;
  const did2ParticipantsJoin = useRef(false);
  useEffect(() => {
    if (!did2ParticipantsJoin.current && participantsArrId.length > 1) {
      did2ParticipantsJoin.current = true;
    }
  }, [participantsArrId.length]);

  if (!call || (did2ParticipantsJoin.current && isRinging)) return null;
  if (isRinging) return <Ringing />;

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <ParticipantList
        participants={participantsArrId.filter(
          id => participants.get(id)?.displayName !== 'AI_MODEL'
        )}
      />
      <ControlsContainer />
    </View>
  );
};

type MeetingScreenProps = { meetingId: string };
const MeetingScreen: React.FC<MeetingScreenProps> = ({ meetingId }) => (
  <SafeAreaView style={styles.appContainer}>
    <MeetingProvider
      config={{ meetingId, micEnabled: true, webcamEnabled: true, name: 'Expo User' }}
      token={token}
    >
      <MeetingView />
    </MeetingProvider>
  </SafeAreaView>
);

const App: React.FC = () => {
  const { meetingId: meetingIdQueryParam } = useLocalSearchParams<{ meetingId: string }>();
  const [meetingId, setMeetingId] = useState<string | null>(meetingIdQueryParam ?? null);
  const getMeetingId = async (id?: string) => setMeetingId(id == null ? await createMeeting() : id);

  useEffect(() => {
    setMeetingId(meetingIdQueryParam);
  }, [meetingIdQueryParam]);

  return meetingId ? (
    <MeetingScreen meetingId={meetingId} />
  ) : (
    <JoinScreen getMeetingId={() => getMeetingId()} setMeetingId={setMeetingId} />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F6FF', justifyContent: 'center', paddingHorizontal: 60 },
  createButton: { backgroundColor: '#1178F8', padding: 12, borderRadius: 6 },
  buttonText: { color: 'white', alignSelf: 'center', fontSize: 18 },
  orText: { alignSelf: 'center', fontSize: 22, marginVertical: 16, fontStyle: 'italic', color: 'grey' },
  textInput: { padding: 12, borderWidth: 1, borderRadius: 6, fontStyle: 'italic' },
  joinButton: { backgroundColor: '#1178F8', padding: 12, marginTop: 14, borderRadius: 6 },
  appContainer: { flex: 1, backgroundColor: '#F6F6FF' },
});

export default App;
