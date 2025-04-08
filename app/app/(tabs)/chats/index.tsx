import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ChatRow, ChatRowProps } from '@/components/ChatRow';
import { defaultStyles } from '@/constants/Styles';
import { Fragment } from 'react';
import { useChatsQuery } from '@/api/chat/chats-query';
import { useAppContext } from '@/context/app-context';
import { useUpdateContacts } from '@/context/use-update-contacts';
import { useContactsQuery } from '@/api/contacts-query';
import { Link } from 'expo-router';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const Page = () => {
  const { phoneNumber } = useAppContext();

  const { contacts } = useUpdateContacts({ phoneNumber });
  const { data, isPending } = useChatsQuery({ phoneNumber });
  const { data: _data = [], isPending: isPendingContacts } = useContactsQuery({
    phoneNumber,
  });

  // const chats = data ?? [];

  const chatRows: ChatRowProps[] = (data ?? [])
    .filter((chat) => chat.totalNumberOfMessagesInChat > 0)
    .map((chat) => {
      const from = chat.participants.map((p) => p.phoneNumber)[0]!;
      const fromContact = contacts.find(
        (c) => c.phoneNumbers[0]?.number === from
      );
      const fromContactQuery = _data.find(
        (c) => c.contactUserId.phoneNumber === from
      );

      return {
        id: chat._id,
        from: fromContact
          ? fromContact.givenName + fromContact.familyName
          : from,
        date: chat.createdAt,
        img: fromContactQuery?.contactUserId.profilePicture ?? '',
        msg: chat.lastMessage,
        read: true,
        unreadCount: 0,
      } satisfies ChatRowProps;
    });

  console.log(isPendingContacts);
  if (isPending || isPendingContacts)
    return (
      <ActivityIndicator
        color={Colors.primary}
        style={{
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    );

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        backgroundColor: '#fff',
      }}
    >
      {chatRows.length === 0 ? (
        <View style={styles.container}>
          <Ionicons name="chatbubbles-outline" color={Colors.gray} size={150} />
          <Text style={styles.title}>No Chats Yet</Text>
          <Text style={styles.subtitle}>
            Tap below to start a new conversation.
          </Text>
          <Link href="/(modals)/new-chat" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Start a Chat</Text>
            </TouchableOpacity>
          </Link>
        </View>
      ) : (
        chatRows.map((chat) => (
          <Fragment key={chat.id}>
            <ChatRow {...chat} />
            <View style={[defaultStyles.separator, { marginLeft: 90 }]} />
          </Fragment>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Page;
