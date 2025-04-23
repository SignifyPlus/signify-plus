import React, { useEffect, useState } from 'react';
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
} from '@videosdk.live/react-native-sdk';
import { createMeeting, token } from '@/api';
import { useLocalSearchParams } from 'expo-router';
import { ControlsContainer } from '@/components/ControlsContainer';
import { useAppContext } from '@/context/app-context';
import { useUpdateContacts } from '@/context/use-update-contacts';

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

const MeetingView: React.FC = () => {
  const { incomingCallUser, phoneNumber, callingUser } = useAppContext();

  const { contacts } = useUpdateContacts({ phoneNumber });
  const contact = contacts.find((contact) => {
    return contact.phoneNumbers[0]?.number === callingUser;
  });

  const { participants, localParticipant, join } = useMeeting();
  const participantsArrId = Array.from(participants.keys());
  const joinedRef = React.useRef(false);

  useEffect(() => {
    if (joinedRef.current) {
      return;
    }

    if (!localParticipant?.id) {
      joinedRef.current = true;
      setTimeout(() => {
        join();
      }, 200);
    }
  }, [join, localParticipant?.id, participantsArrId]);

  return (
    <View
      style={{
        flex: 1,
        position: 'relative',
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
              {(incomingCallUser?.displayName ?? contact?.displayName ?? 'A')
                .charAt(0)
                .toUpperCase()}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              marginBottom: 10,
            }}
          >
            {incomingCallUser?.displayName ??
              contact?.displayName ??
              'Unknown Caller'}
          </Text>
        </View>
      </View>
      <ControlsContainer hideVideo />
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
          webcamEnabled: false,
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

  appContainer: {
    flex: 1,
    backgroundColor: '#F6F6FF',
  },
});

export default App;
