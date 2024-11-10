import { PageView } from "@/components/page-view/page-view";
import { ChatList } from "@/components/chat-list/chat-list";
import { chats } from "@/mocks/mock-chats-list";
import { View } from "react-native";

export default function Chats() {
  return (
    <PageView>
      <ChatList chats={chats} />
    </PageView>
  );
}
