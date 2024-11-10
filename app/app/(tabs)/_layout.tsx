import { Tabs, useNavigation, useRouter, useSegments } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
    >
      <Tabs.Screen
        name="chats"
        options={{
          headerShown: false,
          title: "Chats",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "chatbubble" : "chatbubble-outline"}
              color={color}
            />
          ),
          // TODO: causes a jerk when switching between tabs
          // tabBarStyle: {
          //   display:
          //     segment[segment.length - 1] === "[chatId]" ? "none" : "flex",
          // },
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "cog" : "cog-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}
