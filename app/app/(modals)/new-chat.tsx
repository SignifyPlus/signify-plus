import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '@/constants/Colors';
import { AlphabetList, IData } from 'react-native-section-alphabet-list';
import { defaultStyles } from '@/constants/Styles';
import { useMemo } from 'react';
import { useAppContext } from '@/context/app-context';
import { useContactsQuery } from '@/api/contacts-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/api';
import { useUpdateContacts } from '@/context/use-update-contacts';
import { Ionicons } from '@expo/vector-icons';
import { useCreateChatMutation } from '@/api/chat/create-chat-mutation';
import { useChatsQuery } from '@/api/chat/chats-query';
import { useRouter } from 'expo-router';

type Item = {
  value: string;
  name: string;
  img: string | null;
  desc: string | null;
  key: string;
};

const Page = () => {
  const { phoneNumber } = useAppContext();

  const { contacts } = useUpdateContacts({ phoneNumber });
  const { data: _data = [] } = useContactsQuery({ phoneNumber });
  const { data: chats } = useChatsQuery({ phoneNumber });
  const { mutateAsync } = useCreateChatMutation();

  const router = useRouter();

  const data = useMemo(() => {
    return _data
      .map((contact, index) => {
        const savedContact = contacts.find(
          (c) => c.phoneNumbers[0]?.number === contact.contactUserId.phoneNumber
        );
        if (!savedContact) return null;

        return {
          value: contact.contactUserId.phoneNumber,
          name: 'osama',
          img: contact.contactUserId.profilePicture,
          desc: '',
          key: `${contact.contactUserId.name}-${index}`,
        } satisfies Item;
      })
      .filter((contact) => contact) as IData[];
  }, [_data, contacts]);

  // const data = _data.map((contact, index) => ({
  //   value: contact.name,
  //   name: contact.name,
  //   img: contact.profilePicture,
  //   desc: contact.status ?? '',
  //   key: `${contact.name}-${index}`,
  // }));

  return (
    <View
      style={{ flex: 1, paddingTop: 110, backgroundColor: Colors.background }}
    >
      <AlphabetList
        data={data}
        stickySectionHeadersEnabled
        indexLetterStyle={{
          color: Colors.primary,
          fontSize: 12,
        }}
        indexContainerStyle={{
          width: 24,
          backgroundColor: Colors.background,
        }}
        renderCustomItem={(item: any) => (
          <TouchableOpacity
            onPress={async () => {
              if (!phoneNumber) return;
              const exisingChat = chats?.find((chat) =>
                chat.participants.find(
                  (participant) => participant.phoneNumber === item.value
                )
              );
              if (exisingChat) {
                router.push(`/chats/${exisingChat._id}`);
              } else {
                const result = await mutateAsync({
                  mainUserPhoneNumber: phoneNumber,
                  participants: [item.value],
                });
                router.push(`/chats/${result._id}`);
              }
            }}
          >
            <View style={styles.listItemContainer}>
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
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{ color: '#000', fontSize: 16, fontWeight: '500' }}
                >
                  {item.name}
                </Text>
                <Text style={{ color: '#000', fontSize: 12 }}>
                  {item.value}
                </Text>
                {/*<Text style={{ color: Colors.gray, fontSize: 12 }}>*/}
                {/*  {item.desc.length > 40*/}
                {/*    ? `${item.desc.substring(0, 40)}...`*/}
                {/*    : item.desc}*/}
                {/*</Text>*/}
              </View>
            </View>
            <View style={[defaultStyles.separator, { marginLeft: 50 }]} />
          </TouchableOpacity>
        )}
        renderCustomSectionHeader={(section) => (
          <View style={styles.sectionHeaderContainer}>
            <Text style={{ color: Colors.gray }}>{section['title']}</Text>
          </View>
        )}
        style={{
          marginLeft: 14,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listItemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 50,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
  },

  sectionHeaderContainer: {
    height: 30,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
});

const WrappedPage = (props: any) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Page {...props} />
    </QueryClientProvider>
  );
};
export default WrappedPage;
