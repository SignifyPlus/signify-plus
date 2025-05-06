import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Link, Stack, usePathname } from 'expo-router';
import {
  Platform,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useAppContext } from '@/context/app-context';
import { useChatsQuery } from '@/api/chat/chats-query';
import { Fragment, useEffect, useState } from 'react';
import { useUpdateContacts } from '@/context/use-update-contacts';

const Layout = () => {
  const path = usePathname();
  const chatId = path.split('/').pop();

  const { phoneNumber, setChatsSearchQuery, callUser } = useAppContext();
  const { contacts } = useUpdateContacts({ phoneNumber });
  const { data: chats } = useChatsQuery({ phoneNumber });

  const chat = chats?.find((chat) => chat._id === chatId);
  const chatPhoneNumber = chat?.participants
    .filter((p) => p.phoneNumber !== phoneNumber)
    .map((p) => p.phoneNumber)[0];
  const chatParticipant = chat?.participants.find(
    (p) => p.phoneNumber !== phoneNumber
  );

  const contact = contacts.find((contact) => {
    if (contact.phoneNumbers[0]?.number === chatPhoneNumber) {
      return contact;
    }
    return null;
  });

  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    return () => {
      setChatsSearchQuery('');
    };
  }, [setChatsSearchQuery]);

  return (
    <Fragment>
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
              onChangeText: (e) => {
                setChatsSearchQuery(e.nativeEvent.text);
              },
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
                {chatParticipant?.profilePicture ? (
                  <Pressable onPress={() => setShowAvatarModal(true)}>
                    <Image
                      source={{ uri: chatParticipant.profilePicture }}
                      style={{ width: 32, height: 32, borderRadius: 50 }}
                    />
                  </Pressable>
                ) : (
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
                )}
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
                    if (chatPhoneNumber) callUser('video', chatPhoneNumber);
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
                    if (chatPhoneNumber) callUser('voice', chatPhoneNumber);
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

        <Stack.Screen
          name="archived"
          options={{
            title: 'Archived Chats',
            headerStyle: {
              backgroundColor: Colors.background,
            },
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: 'bold',
            },
          }}
        />
      </Stack>

      {/* Avatar Fullscreen Modal */}
      {chatParticipant?.profilePicture && (
        <Modal visible={showAvatarModal} transparent>
          <View style={styles.modalContainer}>
            <Image
              source={{ uri: chatParticipant.profilePicture }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAvatarModal(false)}
            >
              <Ionicons name="close" size={32} color="white" />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
  },
});

export default Layout;
