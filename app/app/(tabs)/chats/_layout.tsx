import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Link, Stack, usePathname } from 'expo-router';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '@/context/app-context';
import { useChatsQuery } from '@/api/chat/chats-query';
import { useEffect } from 'react';
import { useUpdateContacts } from '@/context/use-update-contacts';

const Layout = () => {
  const path = usePathname();
  const chatId = path.split('/').pop();

  const { phoneNumber, setChatsSearchQuery, videoCallUser, voiceCallUser } =
    useAppContext();
  const { contacts } = useUpdateContacts({ phoneNumber });
  const { data: chats } = useChatsQuery({ phoneNumber });

  const chat = chats?.find((chat) => chat._id === chatId);
  const chatPhoneNumber = chat?.participants
    .filter((p) => p.phoneNumber !== phoneNumber)
    .map((p) => p.phoneNumber)[0];

  const contact = contacts.find((contact) => {
    if (contact.phoneNumbers[0]?.number === chatPhoneNumber) {
      return contact;
    }
    return null;
  });

  useEffect(() => {
    return () => {
      setChatsSearchQuery('');
    };
  }, [setChatsSearchQuery]);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Chats',
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 30 }}>
              <Link href="/(modals)/new-chat" asChild>
                <TouchableOpacity>
                  <Ionicons
                    name="add-circle"
                    color={Colors.primary}
                    size={30}
                  />
                </TouchableOpacity>
              </Link>
            </View>
          ),
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerSearchBarOptions: {
            placeholder: 'Search',
          },
        }}
      />

      <Stack.Screen
        name="[id]"
        options={{
          title: '',
          headerBackTitleVisible: false,
          headerTitle: () => (
            <View
              style={{
                flexDirection: 'row',
                width: 220,
                alignItems: 'center',
                gap: 10,
                paddingBottom: 4,
                justifyContent: 'flex-start',
                marginLeft: Platform.OS === 'ios' ? -100 : 0,
              }}
            >
              {/*<Image*/}
              {/*  source={{*/}
              {/*    uri: 'https://avatars.githubusercontent.com/u/97961673?v=4',*/}
              {/*  }}*/}
              {/*  style={{ width: 32, height: 32, borderRadius: 50 }}*/}
              {/*/>*/}
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: Colors.lightGray,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="person-outline" />
              </View>
              <Text style={{ fontSize: 16, fontWeight: '500' }}>
                {contact?.displayName ?? chatPhoneNumber}
              </Text>
            </View>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 30 }}>
              <TouchableOpacity
                disabled={!chatPhoneNumber}
                onPress={() => {
                  if (chatPhoneNumber) videoCallUser(chatPhoneNumber);
                }}
              >
                <Ionicons
                  name="videocam-outline"
                  color={Colors.primary}
                  size={22}
                />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={!chatPhoneNumber}
                onPress={() => {
                  if (chatPhoneNumber) voiceCallUser(chatPhoneNumber);
                }}
              >
                <Ionicons
                  name="call-outline"
                  color={Colors.primary}
                  size={22}
                />
              </TouchableOpacity>
            </View>
          ),
          headerStyle: {
            backgroundColor: Colors.background,
          },
        }}
      />
    </Stack>
  );
};
export default Layout;
