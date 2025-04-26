import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useMeeting } from '@videosdk.live/react-native-sdk';
import { ParticipantView } from './ParticipantView';

interface ParticipantListProps {
  participants: string[];
}

export const ParticipantList: React.FC<ParticipantListProps> = ({
  participants: participantsList,
}) => {
  const { localParticipant } = useMeeting();
  // const { callingUser, incomingCallUser, phoneNumber } = useAppContext();
  // const { contacts } = useUpdateContacts({ phoneNumber });
  // const contact = contacts.find((contact) => {
  //   return contact.phoneNumbers[0]?.number === callingUser;
  // });

  const set = new Set(participantsList.filter(Boolean));
  const participants = Array.from(set);

  const [isLocalFullscreen, setIsLocalFullscreen] = useState(false);

  // if (participants.length < 2) {
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         justifyContent: 'space-between',
  //         alignItems: 'center',
  //         paddingVertical: 50,
  //       }}
  //     >
  //       <View
  //         style={{
  //           alignItems: 'center',
  //           marginTop: 50,
  //         }}
  //       >
  //         <View
  //           style={{
  //             width: 100,
  //             height: 100,
  //             borderRadius: 50,
  //             backgroundColor: '#404040',
  //             justifyContent: 'center',
  //             alignItems: 'center',
  //             marginBottom: 20,
  //           }}
  //         >
  //           <Text
  //             style={{
  //               fontSize: 40,
  //               color: 'white',
  //             }}
  //           >
  //             {(incomingCallUser?.displayName ?? contact?.displayName ?? 'A')
  //               .charAt(0)
  //               .toUpperCase()}
  //           </Text>
  //         </View>
  //         <Text
  //           style={{
  //             fontSize: 24,
  //             fontWeight: 'bold',
  //             marginBottom: 10,
  //           }}
  //         >
  //           {incomingCallUser?.displayName ??
  //             contact?.displayName ??
  //             'Unknown Caller'}
  //         </Text>
  //         <Text
  //           style={{
  //             fontSize: 16,
  //             marginBottom: 10,
  //           }}
  //         >
  //           Ringing...
  //         </Text>
  //       </View>
  //     </View>
  //   );
  // }

  if (participants.length > 2) {
    return (
      <View style={{ flex: 1 }}>
        <Text>
          Received {participants.length} participants which is currently
          unsupported
        </Text>
      </View>
    );
  }

  const localParticipantId = localParticipant?.id;
  const remoteParticipantId = participants.find(
    (id) => id !== localParticipantId
  )!;
  const fullscreenId = isLocalFullscreen
    ? localParticipantId
    : remoteParticipantId;
  const pipId = isLocalFullscreen ? remoteParticipantId : localParticipantId;

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ccc',
        }}
      >
        <ParticipantView
          zOrder={0}
          participantId={fullscreenId}
          style={{
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
          }}
        />
      </View>

      {pipId ? (
        <TouchableOpacity onPress={() => setIsLocalFullscreen((prev) => !prev)}>
          <View
            style={{
              position: 'absolute',
              backgroundColor: '#fffa',
              borderRadius: 8,
              overflow: 'hidden',
              width: 100,
              height: 150,
              bottom: 136,
              right: 16,
            }}
          >
            <ParticipantView zOrder={1} participantId={pipId} />
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
