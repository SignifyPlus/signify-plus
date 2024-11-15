import React from "react";
import { Stack, useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { chats } from "@/mocks/mock-chats-list";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "@/store/store";

const HeaderTitle = (props: { children: string }) => {
  const phoneNumber = props.children;

  const router = useRouter();
  const chat = chats.find((chat) => chat.phoneNumber === phoneNumber);

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          width: "70%",
        }}
      >
        <Image
          source={{ uri: chat?.avatar }}
          style={{ width: 32, height: 32, borderRadius: 20 }}
        />
        <Text>{props.children}</Text>
      </View>
      <TouchableOpacity
        disabled={!chat}
        onPress={() => {
          if (chat?.phoneNumber) {
            router.push(`/chats/video-call/${chat.phoneNumber}`);
          }
        }}
      >
        <View
          style={{
            width: 30,
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            borderRadius: 16,
          }}
        >
          <Ionicons size={24} name="videocam-outline" color="#1D3D47" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default function ChatsStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Chats",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="[chatId]"
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          headerTitle: HeaderTitle,
          headerTintColor: "#1D3D47",
        }}
      />
    </Stack>
  );
}
