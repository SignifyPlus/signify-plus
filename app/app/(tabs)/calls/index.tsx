import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppContext } from '@/context/app-context';
import { useEffect } from 'react';
import { useCallHistoryQuery } from '@/api/call/call-history-query';
import Colors from '@/constants/Colors';
import { CallLogItemAppleStyleSwipeableRow } from '@/components/CallLogItemAppleStyleSwipeableRow';
import dayjs from 'dayjs';
import { useUpdateContacts } from '@/context/use-update-contacts';
import { sanitizePhoneNumber } from '@/constants/utils';

type Call = {
  id: string;
  name: string;
  type: 'incoming' | 'outgoing' | 'missed';
  time: string;
  timeOfCall: string;
  missed: boolean;
  avatar?: string;
  isVideo: boolean;
  participants: string[];
};

const CallItem = ({ item }: { item: Call }) => {
  const { callUser, phoneNumber } = useAppContext();

  return (
    <CallLogItemAppleStyleSwipeableRow
      callId={item.id}
      userPhoneNumber={phoneNumber!}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          gap: 12,
        }}
      >
        {item.avatar ? (
          <Image
            source={{ uri: item.avatar }}
            style={{ width: 48, height: 48, borderRadius: 24, marginRight: 16 }}
          />
        ) : (
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              backgroundColor: Colors.lightGray,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons name="person-outline" size={24} />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
          <Text
            style={{
              fontSize: 14,
              color: item.missed ? 'red' : 'gray',
              marginTop: 4,
            }}
          >
            {item.type === 'incoming' ? 'Incoming' : 'Outgoing'} -{' '}
            {item.isVideo ? 'Video' : 'Voice'} Call
          </Text>
          <Text style={{ fontSize: 12, color: 'gray', marginTop: 2 }}>
            {dayjs(item.timeOfCall).format('hh:mm:ss a - DD/MM/YYYY')}
          </Text>
        </View>
        <TouchableOpacity
          style={{ marginRight: 12 }}
          onPress={() => {
            callUser('voice', item.participants[0]!);
          }}
        >
          <Ionicons name="call-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            callUser('video', item.participants[0]!);
          }}
        >
          <Ionicons name="videocam-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </CallLogItemAppleStyleSwipeableRow>
  );
};

const Page = () => {
  const { callSearchQuery, setCallSearchQuery, phoneNumber, user } =
    useAppContext();

  const { data: callData = [] } = useCallHistoryQuery({ phoneNumber });

  const { contacts } = useUpdateContacts({
    phoneNumber,
  });

  const _calls: Call[] = callData
    .filter((callEntry) => {
      if (callEntry.deletedBy && callEntry.deletedBy.includes(user!._id)) {
        return false;
      }

      return true;
    })
    .map((callEntry) => {
      const [otherParticipant] = callEntry.participants.filter(
        (participant) => participant.phoneNumber !== phoneNumber
      );

      return {
        id: callEntry._id,
        name:
          contacts.find((contact) =>
            contact.phoneNumbers.some(
              (phone) =>
                sanitizePhoneNumber(phone.number) ===
                otherParticipant!.phoneNumber
            )
          )?.displayName ??
          (otherParticipant?.name ||
            otherParticipant?.phoneNumber ||
            'Unknown'),
        type: callEntry.callType as 'incoming' | 'outgoing' | 'missed',
        time: formatDuration(callEntry.callDurationInSeconds),
        timeOfCall: callEntry.createdAt,
        missed: callEntry.callType === 'missed',
        avatar: otherParticipant?.profilePicture,
        isVideo: callEntry.callType === 'video',
        participants: callEntry.participants
          .map((it) => it.phoneNumber)
          .filter((it) => it !== phoneNumber),
      };
    })
    .sort((a, b) =>
      dayjs(a.timeOfCall).isBefore(dayjs(b.timeOfCall)) ? 1 : -1
    );

  const calls = _calls.filter((call) => {
    if (callSearchQuery === '') return true;

    const searchLower = callSearchQuery.toLowerCase();
    return (
      call.name.toLowerCase().includes(searchLower) ||
      call.participants.some((participant) =>
        participant.toLowerCase().includes(searchLower)
      )
    );
  });

  useEffect(() => {
    return () => {
      setCallSearchQuery('');
    };
  }, [setCallSearchQuery]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      {calls.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <Ionicons name="call-outline" size={120} color={Colors.gray} />
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              color: '#333',
              marginTop: 16,
            }}
          >
            No Calls Yet
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: '#666',
              textAlign: 'center',
              marginTop: 8,
            }}
          >
            Your recent calls will show up here.
          </Text>
        </View>
      ) : (
        calls.map((item, index) => (
          <View key={item.id}>
            <CallItem item={item} />
            {calls.length - 1 === index ? null : (
              <View
                style={{
                  height: 1,
                  backgroundColor: '#E0E0E0',
                  marginHorizontal: 16,
                }}
              />
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default Page;

function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (hrs > 0) parts.push(`${hrs}h`);
  if (mins > 0 || hrs > 0) parts.push(`${mins}m`);
  parts.push(`${secs}s`);

  return parts.join(' ');
}
