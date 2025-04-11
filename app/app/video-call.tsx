import React, { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  MediaStream,
  MeetingProvider,
  register,
  RTCView,
  useMeeting,
  useParticipant,
} from '@videosdk.live/react-native-sdk';
import { createMeeting, token } from '@/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import GestureOverlay from '@/components/GestureOverlay';
import { Ionicons } from '@expo/vector-icons';
import { ML_WEBSOCKET_URL,  } from '@/constants/Config';
register();

interface JoinScreenProps {
  getMeetingId: () => void;
  setMeetingId: (id: string) => void;
}

const JoinScreen: React.FC<JoinScreenProps> = ({
  getMeetingId,
  setMeetingId,
}) => {
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
        onPress={() => {
          // console.log("User Input: ", meetingVal);
          setMeetingId(meetingVal);
        }}
      >
        <Text style={styles.buttonText}>Join Meeting</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

interface ParticipantViewProps {
  participantId: string;
}

const ParticipantView: React.FC<ParticipantViewProps> = ({ participantId }) => {
  const { webcamStream, webcamOn } = useParticipant(participantId);
  const [predictions, setPredictions] = useState([]);

   // Monitor predictions changes
   useEffect(() => {
    console.log('Predictions updated:', predictions);
  }, [predictions]);
  // Set up WebSocket connection for predictions
  useEffect(() => {
    console.log('Setting up WebSocket connection...');
    const ws = new WebSocket(ML_WEBSOCKET_URL);

    ws.onopen = () => {
      console.log('WebSocket Connected!');
    };
    ws.onmessage = (event) => {
      console.log('Received message:', event.data);
      try {
        const response = JSON.parse(event.data);
        console.log('Parsed response:', response);
        if (response.status === 'success') {
          console.log('Setting predictions:', response.predictions);
          setPredictions(response.predictions);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
    };
    return () => {
      console.log('Cleaning up WebSocket connection...');
      ws.close();
    };
  }, []);


  return webcamOn && webcamStream ? (
    <View style={{ position: 'relative', height: 300, marginVertical: 2 }}>
      <RTCView
        streamURL={new MediaStream([webcamStream.track]).toURL()}
        objectFit="cover"
        style={{ height: '100%', width: '100%' }}
        mirror={true}
      />
      <GestureOverlay predictions={predictions} />
    </View>
  ) : (
    <View style={styles.noMediaView}>
      <Text style={styles.noMediaText}>NO MEDIA</Text>
    </View>
  );
};

interface ParticipantListProps {
  participants: string[];
}

const ParticipantList: React.FC<ParticipantListProps> = ({ participants }) => {
  if (participants.length === 1) {
    return (
      <View style={{ flex: 1 }}>
        <ParticipantView participantId={participants[0]!} />
      </View>
    );
  }

  if (participants.length === 2) {
    return (
      <View style={{ flex: 1 }}>
        <ParticipantView participantId={participants[0]!} />
        <ParticipantView participantId={participants[1]!} />
      </View>
    );
  }

  return participants.length > 0 ? (
    <FlatList
      data={participants}
      renderItem={({ item }) => <ParticipantView participantId={item} />}
      keyExtractor={(item) => item}
    />
  ) : (
    <View style={styles.emptyView}>
      <Text style={styles.emptyText}>Press Join button to enter meeting.</Text>
    </View>
  );
};

const ControlsContainer: React.FC = () => {
  const { join, leave, toggleWebcam, toggleMic, localParticipant } =
    useMeeting();
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
        console.error('Failed to clear meeting ID on server:', response.status);
      } else {
        console.log('Meeting ID cleared on server.');
      }
    } catch (error) {
      console.error('Error clearing meeting ID on server:', error);
    }
  };

  return (
    <View
      style={{
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
          await clearMeetingIdOnServer();
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

const MeetingView: React.FC = () => {
  const { participants, localParticipant, join } = useMeeting();
  const participantsArrId = Array.from(participants.keys());
  const joinedRef = React.useRef(false);

   // Filter out the AI_MODEL participant by name
   const participantsFiltered = Array.from(participants.keys()).filter(participantId => {
    const participant = participants.get(participantId);
    return participant?.displayName !== 'AI_MODEL';
  });


  useEffect(() => {
    if (joinedRef.current) {
      return;
    }

    console.log('Joining meeting...', localParticipant?.id);
    if (!localParticipant?.id) {
      joinedRef.current = true;
      setTimeout(() => {
        join();
      }, 200);
    }
  }, [join, localParticipant?.id, participantsFiltered]);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <ParticipantList participants={participantsArrId} />
      <ControlsContainer />
    </View>
  );
};

type MeetingScreenProps = {
  meetingId: string;
};
const MeetingScreen: React.FC<MeetingScreenProps> = (props) => {
  const { meetingId } = props;

  return (
    <SafeAreaView style={styles.appContainer}>
      <MeetingProvider
        config={{
          meetingId,
          micEnabled: true,
          webcamEnabled: true,
          name: 'Expo User',
        }}
        token={token}
      >
        <MeetingView />
      </MeetingProvider>
    </SafeAreaView>
  );
};

const App: React.FC = () => {
  const { meetingId: meetingIdQueryParam } = useLocalSearchParams<{
    meetingId: string;
  }>();
  const [meetingId, setMeetingId] = useState<string | null>(
    meetingIdQueryParam ?? null
  );

  const getMeetingId = async (id?: string) => {
    if (!token) {
      // console.log("PLEASE PROVIDE TOKEN IN api.js FROM app.videosdk.live");
    }
    const newMeetingId = id == null ? await createMeeting() : id;
    setMeetingId(newMeetingId);
  };

  console.log('meetingId isssss', meetingId);

  useEffect(() => {
    setMeetingId(meetingIdQueryParam);
  }, [meetingIdQueryParam]);

  return meetingId ? (
    <MeetingScreen meetingId={meetingId} />
  ) : (
    <JoinScreen
      getMeetingId={() => getMeetingId()}
      setMeetingId={setMeetingId}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6FF',
    justifyContent: 'center',
    paddingHorizontal: 60,
  },
  createButton: {
    backgroundColor: '#1178F8',
    padding: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 18,
  },
  orText: {
    alignSelf: 'center',
    fontSize: 22,
    marginVertical: 16,
    fontStyle: 'italic',
    color: 'grey',
  },
  textInput: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 6,
    fontStyle: 'italic',
  },
  joinButton: {
    backgroundColor: '#1178F8',
    padding: 12,
    marginTop: 14,
    borderRadius: 6,
  },
  noMediaView: {
    backgroundColor: 'grey',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMediaText: {
    fontSize: 16,
  },
  emptyView: {
    flex: 1,
    backgroundColor: '#F6F6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
  },

  appContainer: {
    flex: 1,
    backgroundColor: '#F6F6FF',
  },
});

export default App;