import Colors from '../../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Link, Stack, usePathname } from 'expo-router';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../../../context/app-context';
import chats from '../../../assets/data/chats.json';

const Layout = () => {
  const path = usePathname();
  const chatId = path.split('/').pop();
  const chat = chats.find((chat) => chat.id === chatId);
  const chatPhoneNumber = chat?.phoneNumber;

  const { videoCallUser } = useAppContext();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Chats',
          // headerLargeTitle: isIos,
          // headerTransparent: isIos,
          // headerBlurEffect: "regular",
          headerLeft: () => (
            <TouchableOpacity>
              <Ionicons
                name="ellipsis-horizontal-circle-outline"
                color={Colors.primary}
                size={30}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 30 }}>
              <TouchableOpacity>
                <Ionicons
                  name="camera-outline"
                  color={Colors.primary}
                  size={30}
                />
              </TouchableOpacity>
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
              <Image
                source={{
                  uri: 'https://avatars.githubusercontent.com/u/97961673?v=4',
                }}
                style={{ width: 32, height: 32, borderRadius: 50 }}
              />
              <Text style={{ fontSize: 16, fontWeight: '500' }}>
                Iman Zahid
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
              <TouchableOpacity>
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
