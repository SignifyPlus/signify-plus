import { ChatMessageBox } from '@/components/ChatMessageBox';
import { ReplyMessageBar } from '@/components/ReplyMessageBar';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ImageBackground,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import {
  Bubble,
  GiftedChat,
  IMessage,
  InputToolbar,
  InputToolbarProps,
  Send,
  SystemMessage,
} from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChatMessagesQuery } from '@/api/chat/chats-messages-query';
import { useLocalSearchParams } from 'expo-router';
import { useAppContext } from '@/context/app-context';
import { useChatsQuery } from '@/api/chat/chats-query';
import { queryClient } from '@/api';

const Page = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState('');
  const insets = useSafeAreaInsets();

  const { id } = useLocalSearchParams();

  const { data, isPending } = useChatMessagesQuery(id as string | undefined);

  const { sendMessage, phoneNumber } = useAppContext();
  const { data: chats } = useChatsQuery({ phoneNumber });

  const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);
  const swipeableRowRef = useRef<Swipeable | null>(null);

  console.log('chat messages', data?.[0]?.content);

  useEffect(() => {
    if (!data) return;
    setMessages(
      data.map((message) => {
        return {
          _id: message._id,
          text: message.content,
          createdAt: new Date(message.createdAt),
          user: {
            _id: message.senderId._id,
          },
        };
      })
    );
  }, [data]);

  const onSend = useCallback(
    async (messages: IMessage[] = []) => {
      // setMessages((previousMessages: any[]) =>
      //   GiftedChat.append(previousMessages, messages)
      // );
      const chat = chats?.find((chat) => chat._id === id);
      console.log('sending message in chat', chat?._id);
      if (chat) {
        messages.forEach((message) => {
          sendMessage(
            message.text,
            chat.participants.map((p) => p.phoneNumber)
          );
        });
      }
      // setTimeout(() => {
      void queryClient.invalidateQueries();
      // }, 1000);
    },
    [chats, id, sendMessage]
  );

  const renderInputToolbar = (props: InputToolbarProps<IMessage>) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{ backgroundColor: Colors.background }}
        renderActions={() => (
          <View
            style={{
              height: 44,
              justifyContent: 'center',
              alignItems: 'center',
              left: 5,
            }}
          >
            <Ionicons name="add" color={Colors.primary} size={28} />
          </View>
        )}
      />
    );
  };

  const updateRowRef = useCallback(
    (ref: any) => {
      if (
        ref &&
        replyMessage &&
        ref.props.children.props.currentMessage?._id === replyMessage._id
      ) {
        swipeableRowRef.current = ref;
      }
    },
    [replyMessage]
  );

  useEffect(() => {
    if (replyMessage && swipeableRowRef.current) {
      swipeableRowRef.current.close();
      swipeableRowRef.current = null;
    }
  }, [replyMessage]);

  if (isPending)
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
    <ImageBackground
      source={require('@/assets/images/pattern.png')}
      style={{
        flex: 1,
        backgroundColor: Colors.background,
        marginBottom: insets.bottom,
      }}
    >
      <GiftedChat
        messages={messages}
        onSend={(messages: any) => onSend(messages)}
        onInputTextChanged={setText}
        user={{
          _id: 1,
        }}
        renderSystemMessage={(props) => (
          <SystemMessage {...props} textStyle={{ color: Colors.gray }} />
        )}
        bottomOffset={insets.bottom}
        renderAvatar={null}
        maxComposerHeight={100}
        textInputProps={styles.composer}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              textStyle={{
                right: {
                  color: '#000',
                },
              }}
              wrapperStyle={{
                left: {
                  backgroundColor: '#fff',
                },
                right: {
                  backgroundColor: Colors.lightGreen,
                },
              }}
            />
          );
        }}
        renderSend={(props) => (
          <View
            style={{
              height: 44,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              paddingHorizontal: 14,
            }}
          >
            {text === '' && (
              <>
                <Ionicons
                  name="camera-outline"
                  color={Colors.primary}
                  size={28}
                />
                <Ionicons name="mic-outline" color={Colors.primary} size={28} />
              </>
            )}
            {text !== '' && (
              <Send
                {...props}
                containerStyle={{
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="send" color={Colors.primary} size={28} />
              </Send>
            )}
          </View>
        )}
        renderInputToolbar={renderInputToolbar}
        renderChatFooter={() => (
          <ReplyMessageBar
            clearReply={() => setReplyMessage(null)}
            message={replyMessage}
          />
        )}
        onLongPress={(_context, message) => setReplyMessage(message)}
        renderMessage={(props) => (
          <ChatMessageBox
            {...props}
            setReplyOnSwipeOpen={setReplyMessage}
            updateRowRef={updateRowRef}
          />
        )}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  composer: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    paddingHorizontal: 10,
    paddingTop: 8,
    fontSize: 16,
    marginVertical: 4,
  },
});

export default Page;
