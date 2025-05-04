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
import { Link, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const Page = () => {
  const { phoneNumber, chatsSearchQuery, user } = useAppContext();

  const router = useRouter();
  const { contacts } = useUpdateContacts({ phoneNumber });
  const { data, isPending } = useChatsQuery({ phoneNumber });
  const { isPending: isPendingContacts } = useContactsQuery({
    phoneNumber,
  });

  const archivedChats =
    data?.filter((chat) => user && chat.archivedBy.includes(user._id)) ?? [];

  const chatRows: ChatRowProps[] = (data ?? [])
    .filter((chat) => chat.totalNumberOfMessagesInChat > 0)
    .filter(
      (chat) =>
        !(
          user &&
          (chat.archivedBy.includes(user?._id) ||
            chat.deletedBy.includes(user?._id))
        )
    )
    .map((chat) => {
      const fromParticipants = chat.participants.filter(
        (p) => p._id !== user?._id
      );
      const from = fromParticipants.map((p) => p.phoneNumber)[0]!;
      const fromContact = contacts.find(
        (c) => c.phoneNumbers[0]?.number === from
      );

      return {
        id: chat._id,
        from: fromContact
          ? fromContact.givenName + fromContact.familyName
          : from,
        date: chat.createdAt,
        img: fromParticipants[0]?.profilePicture ?? '',
        msg: chat.lastMessage,
        read: true,
        unreadCount: 0,
        isPinned: chat.isPinned,
        pinnedBy: chat.pinnedBy,
      } satisfies ChatRowProps;
    })
    .filter((chatRow) => {
      if (chatsSearchQuery === '') return true;
      const from = chatRow.from.toLowerCase();
      // const msg = chatRow.msg.toLowerCase();
      const searchQuery = chatsSearchQuery.toLowerCase();
      return from.includes(searchQuery);
    })
    .sort((a, b) => {
      // Sort pinned chats to the top
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

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
    <View
      style={{
        flex: 1,
      }}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          backgroundColor: '#fff',
          height: '100%',
          width: '100%',
        }}
      >
        {chatRows.length === 0 ? (
          <View style={styles.container}>
            <Ionicons
              name="chatbubbles-outline"
              color={Colors.gray}
              size={150}
            />
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
              <ChatRow
                {...chat}
                isPinned={user && chat.pinnedBy?.includes(user._id)}
              />
              <View style={[defaultStyles.separator, { marginLeft: 90 }]} />
            </Fragment>
          ))
        )}
      </ScrollView>
      {archivedChats.length > 0 ? (
        <TouchableOpacity
          onPress={() => {
            router.push('/(tabs)/chats/archived');
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 12,
              backgroundColor: '#fff',
              borderTopWidth: 1,
              gap: 12,
              borderTopColor: Colors.lightGray,
              alignContent: 'center',
            }}
          >
            <Ionicons name="archive" size={24} />
            <Text>{`Archived Chats (${archivedChats.length})`}</Text>
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
    height: '100%',
    width: '100%',
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
