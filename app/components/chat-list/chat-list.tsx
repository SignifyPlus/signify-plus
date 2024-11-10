import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Chat } from "@/types/types";
import { Link, useRouter } from "expo-router";

interface ChatListProps {
  chats: Chat[];
}

export const ChatList: React.FC<ChatListProps> = ({ chats }) => {
  const renderItem = ({ item }: { item: Chat }) => (
    <Link href={`/(tabs)/chats/${item.id}`} asChild>
      <TouchableOpacity>
        <View style={styles.chatContainer}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={styles.textContainer}>
            <Text style={styles.phoneNumber}>{item.phoneNumber}</Text>
            <Text style={styles.lastMessage}>{item.lastMessage}</Text>
            <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleString()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <FlatList
      data={chats}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      windowSize={10}
      contentContainerStyle={styles.list}
    />
  );
};

// color={{ light: "#A1CEDC", dark: "#1D3D47" }}

const styles = StyleSheet.create({
  list: {
    // padding: 10,
  },
  chatContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f0f0f0",
    padding: 10,
    // borderTopWidth: 1,
    // borderColor: "#ddd",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  phoneNumber: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  lastMessage: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
  },
});
