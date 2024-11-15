/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/chats` | `/(tabs)/chats/` | `/(tabs)/settings` | `/(tabs)\chats\video-call\[videoCallNumber]` | `/..\store\store` | `/_sitemap` | `/chats` | `/chats/` | `/login` | `/settings` | `/signup`;
      DynamicRoutes: `/(tabs)/chats/${Router.SingleRoutePart<T>}` | `/(tabs)/chats/video-call/${Router.SingleRoutePart<T>}` | `/chats/${Router.SingleRoutePart<T>}` | `/chats/video-call/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/(tabs)/chats/[chatId]` | `/(tabs)/chats/video-call/[videoCallNumber]` | `/chats/[chatId]` | `/chats/video-call/[videoCallNumber]`;
    }
  }
}
