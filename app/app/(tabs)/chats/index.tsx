import { PageView } from "@/components/page-view/page-view";
import { ChatList } from "@/components/chat-list/chat-list";
import { chats } from "@/mocks/mock-chats-list";
import { View } from "react-native";
import { useAppStore } from "@/store/store";
import { VideoCallModal } from "@/components/video-call-modal/video-call-modal";

export default function Chats() {
  return (
    <PageView>
      <ChatList chats={chats} />
    </PageView>
  );
}
