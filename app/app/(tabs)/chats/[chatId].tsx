import {
  Button,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { chats } from "@/mocks/mock-chats-list";
import { PageView } from "@/components/page-view/page-view";
import { Ionicons } from "@expo/vector-icons";

export default function Chat() {
  const inputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const params = useLocalSearchParams();
  const navigation = useNavigation();

  const chat = chats.find((chat) => chat.id === params["chatId"]);

  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState(chat?.messages || []);

  const disabled = !messageText.trim();

  const handleSend = () => {
    if (!disabled) {
      const newMessage = {
        id: Math.random().toString(),
        sender: "self" as const,
        text: messageText,
        timestamp: new Date().toISOString(),
      };
      setMessages([...messages, newMessage]);
      setMessageText("");
      inputRef.current?.clear();
      scrollViewRef.current?.scrollToEnd({
        animated: true,
      });
    }
  };

  useLayoutEffect(() => {
    if (chat)
      navigation.setOptions({
        title: chat.phoneNumber,
      });
  }, [chat, navigation]);

  useEffect(() => {
    if (chat) {
      setMessages(chat.messages);
    }
  }, [chat]);

  return (
    <PageView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 95 : 0}
      >
        <View style={styles.chatArea}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.contentContainer}
          >
            {messages.map((item) => (
              <View
                style={[
                  styles.messageContainer,
                  item.sender === "self"
                    ? styles.selfMessage
                    : styles.contactMessage,
                ]}
                key={item.id}
              >
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.timestamp}>
                  {new Date(item.timestamp).toLocaleTimeString()}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputArea}>
          <TextInput
            ref={inputRef}
            placeholder="Type a message..."
            style={styles.input}
            onChangeText={(text) => setMessageText(text)}
            value={messageText}
            editable
            multiline
          />
          <TouchableOpacity onPress={handleSend} disabled={disabled}>
            <Ionicons
              name={disabled ? "arrow-up-circle-outline" : "arrow-up-circle"}
              size={32}
              color="#1D3D47"
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </PageView>
  );
}

// color={{ light: "#A1CEDC", dark: "#1D3D47" }}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  chatArea: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  messageContainer: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
  },
  selfMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#A1CEDC",
    borderBottomRightRadius: 0,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  contactMessage: {
    alignSelf: "flex-start",
    backgroundColor: "white",
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
    marginTop: 5,
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  input: {
    flex: 1,
    minHeight: 42,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f9f9f9",
    marginRight: 10,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
