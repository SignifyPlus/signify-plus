import { ScrollView, View } from "react-native";
import chats from "../../../assets/data/chats.json";
import { ChatRow } from "../../../components/ChatRow";
import { defaultStyles } from "../../../constants/Styles";
import { Fragment } from "react";

const Page = () => {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        backgroundColor: "#fff",
      }}
    >
      {chats.map((chat) => (
        <Fragment key={chat.id}>
          <ChatRow {...chat} />
          <View style={[defaultStyles.separator, { marginLeft: 90 }]} />
        </Fragment>
      ))}
    </ScrollView>
  );
};

export default Page;
