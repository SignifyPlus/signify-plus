export type Message = {
  id: string;
  text: string;
  timestamp: string;
  sender: "self" | "contact";
};

export type Chat = {
  id: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  phoneNumber: string;
  messages: Message[];
};
