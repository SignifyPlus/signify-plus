import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppContext } from '@/context/app-context';
import { useEffect } from 'react';

type Call = {
  id: string;
  name: string;
  type: 'incoming' | 'outgoing' | 'missed';
  time: string;
  missed: boolean;
  avatar: string;
  isVideo: boolean;
  participants: string[];
};

const _calls: Call[] = [
  {
    id: '1',
    name: 'John Doe',
    type: 'incoming',
    time: 'Today, 3:45 PM',
    missed: false,
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    isVideo: false,
    participants: ['+12035550123', '+12035550124', '+12035550125'],
  },
  {
    id: '2',
    name: 'Jane Smith',
    type: 'outgoing',
    time: 'Yesterday, 6:20 PM',
    missed: true,
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    isVideo: true,
    participants: ['+12035550126', '+12035550127'],
  },
  {
    id: '3',
    name: 'Alice Johnson',
    type: 'missed',
    time: 'Today, 11:15 AM',
    missed: true,
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    isVideo: false,
    participants: [
      '+12035550128',
      '+12035550129',
      '+12035550130',
      '+12035550131',
    ],
  },
  {
    id: '4',
    name: 'Bob Williams',
    type: 'incoming',
    time: 'Today, 9:50 AM',
    missed: false,
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    isVideo: true,
    participants: ['+12035550132', '+12035550133'],
  },
  {
    id: '5',
    name: 'Catherine Brown',
    type: 'outgoing',
    time: 'Two days ago, 2:30 PM',
    missed: false,
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
    isVideo: false,
    participants: ['+12035550134', '+12035550135', '+12035550136'],
  },
  {
    id: '6',
    name: 'Daniel Davis',
    type: 'missed',
    time: 'Yesterday, 8:00 PM',
    missed: true,
    avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
    isVideo: true,
    participants: [
      '+12035550137',
      '+12035550138',
      '+12035550139',
      '+12035550140',
    ],
  },
  {
    id: '7',
    name: 'Emma Wilson',
    type: 'incoming',
    time: 'Today, 1:25 PM',
    missed: false,
    avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
    isVideo: false,
    participants: ['+12035550141', '+12035550142', '+12035550143'],
  },
  {
    id: '8',
    name: 'Frank Moore',
    type: 'outgoing',
    time: 'Three days ago, 5:45 PM',
    missed: false,
    avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
    isVideo: true,
    participants: [
      '+12035550144',
      '+12035550145',
      '+12035550146',
      '+12035550147',
    ],
  },
  {
    id: '9',
    name: 'Grace Taylor',
    type: 'missed',
    time: 'Today, 7:30 AM',
    missed: true,
    avatar: 'https://randomuser.me/api/portraits/women/9.jpg',
    isVideo: false,
    participants: ['+12035550148', '+12035550149'],
  },
  {
    id: '10',
    name: 'Henry Anderson',
    type: 'incoming',
    time: 'Yesterday, 10:10 PM',
    missed: false,
    avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
    isVideo: true,
    participants: ['+12035550150', '+12035550151', '+12035550152'],
  },
];

const CallItem = ({ item }: { item: Call }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
      <Image
        source={{ uri: item.avatar }}
        style={{ width: 48, height: 48, borderRadius: 24, marginRight: 16 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
        <Text
          style={{
            fontSize: 14,
            color: item.missed ? 'red' : 'gray',
            marginTop: 4,
          }}
        >
          {item.type === 'incoming' ? 'Incoming' : 'Outgoing'} - {item.time}
        </Text>
      </View>
      <TouchableOpacity style={{ marginRight: 12 }}>
        <Ionicons name="call-outline" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons name="videocam-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const Page = () => {
  const { callSearchQuery, setCallSearchQuery } = useAppContext();

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
    <ScrollView>
      {calls.map((item, index) => (
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
      ))}
    </ScrollView>
  );
};

export default Page;
