import React, { useState } from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  FlatList,
  StyleSheet,
} from "react-native";
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
  MediaStream,
  RTCView,
  register,
} from "@videosdk.live/react-native-sdk";
import { createMeeting, token } from "@/api";

register();

interface JoinScreenProps {
  getMeetingId: () => void;
  setMeetingId: (id: string) => void;
}

const JoinScreen: React.FC<JoinScreenProps> = ({
  getMeetingId,
  setMeetingId,
}) => {
  const [meetingVal, setMeetingVal] = useState<string>("");

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={getMeetingId} style={styles.createButton}>
        <Text style={styles.buttonText}>Create Meeting</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>---------- OR ----------</Text>

      <TextInput
        value={meetingVal}
        onChangeText={setMeetingVal}
        placeholder={"XXXX-XXXX-XXXX"}
        style={styles.textInput}
      />

      <TouchableOpacity
        style={styles.joinButton}
        onPress={() => {
          console.log("User Input: ", meetingVal);
          setMeetingId(meetingVal);
        }}
      >
        <Text style={styles.buttonText}>Join Meeting</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

interface ButtonProps {
  onPress: () => void;
  buttonText: string;
  backgroundColor: string;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  buttonText,
  backgroundColor,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor }]}
    >
      <Text style={styles.smallButtonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

interface ParticipantViewProps {
  participantId: string;
}

const ParticipantView: React.FC<ParticipantViewProps> = ({ participantId }) => {
  const { webcamStream, webcamOn } = useParticipant(participantId);

  return webcamOn && webcamStream ? (
    <RTCView
      streamURL={new MediaStream([webcamStream.track]).toURL()}
      objectFit="cover"
      style={styles.mediaView}
    />
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
  const { join, leave, toggleWebcam, toggleMic } = useMeeting();

  return (
    <View style={styles.controlsContainer}>
      <Button onPress={join} buttonText="Join" backgroundColor="#1178F8" />
      <Button
        onPress={toggleWebcam}
        buttonText="Toggle Webcam"
        backgroundColor="#1178F8"
      />
      <Button
        onPress={toggleMic}
        buttonText="Toggle Mic"
        backgroundColor="#1178F8"
      />
      <Button onPress={leave} buttonText="Leave" backgroundColor="#FF0000" />
    </View>
  );
};

const MeetingView: React.FC = () => {
  const { participants, meetingId } = useMeeting();
  const participantsArrId = Array.from(participants.keys());

  return (
    <View style={styles.meetingContainer}>
      {meetingId && (
        <Text style={styles.meetingId}>Meeting Id: {meetingId}</Text>
      )}
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
          name: "Expo User",
        }}
        token={token}
      >
        <MeetingView />
      </MeetingProvider>
    </SafeAreaView>
  );
};

const App: React.FC = () => {
  const [meetingId, setMeetingId] = useState<string | null>(null);

  const getMeetingId = async (id?: string) => {
    if (!token) {
      console.log("PLEASE PROVIDE TOKEN IN api.js FROM app.videosdk.live");
    }
    const newMeetingId = id == null ? await createMeeting({ token }) : id;
    setMeetingId(newMeetingId);
  };

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
    backgroundColor: "#F6F6FF",
    justifyContent: "center",
    paddingHorizontal: 60,
  },
  createButton: {
    backgroundColor: "#1178F8",
    padding: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: "white",
    alignSelf: "center",
    fontSize: 18,
  },
  orText: {
    alignSelf: "center",
    fontSize: 22,
    marginVertical: 16,
    fontStyle: "italic",
    color: "grey",
  },
  textInput: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 6,
    fontStyle: "italic",
  },
  joinButton: {
    backgroundColor: "#1178F8",
    padding: 12,
    marginTop: 14,
    borderRadius: 6,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    borderRadius: 4,
  },
  smallButtonText: {
    color: "white",
    fontSize: 12,
  },
  mediaView: {
    height: 300,
    marginVertical: 8,
    marginHorizontal: 8,
  },
  noMediaView: {
    backgroundColor: "grey",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
    marginHorizontal: 8,
  },
  noMediaText: {
    fontSize: 16,
  },
  emptyView: {
    flex: 1,
    backgroundColor: "#F6F6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 20,
  },
  controlsContainer: {
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  meetingContainer: {
    flex: 1,
  },
  meetingId: {
    fontSize: 18,
    padding: 12,
  },
  appContainer: {
    flex: 1,
    backgroundColor: "#F6F6FF",
  },
});

export default App;
