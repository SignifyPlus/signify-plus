import { Chat } from "@/types/types";

export const chats: Chat[] = [
  {
    id: "1",
    lastMessage: "Hey there! Are we still on for Friday?",
    timestamp: "2023-11-10T10:00:00Z",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    phoneNumber: "+1 (555) 123-4567",
    messages: [
      {
        id: "m1",
        sender: "self",
        text: "Hey, how's it going?",
        timestamp: "2023-11-10T09:00:00Z",
      },
      {
        id: "m2",
        sender: "contact",
        text: "Are we still on for Friday?",
        timestamp: "2023-11-10T10:00:00Z",
      },
      {
        id: "m3",
        sender: "self",
        text: "Yes, we're still on!",
        timestamp: "2023-11-10T10:05:00Z",
      },
      {
        id: "m4",
        sender: "contact",
        text: "Great! Looking forward to it.",
        timestamp: "2023-11-10T10:10:00Z",
      },
      {
        id: "m5",
        sender: "self",
        text: "Me too!",
        timestamp: "2023-11-10T10:15:00Z",
      },
      {
        id: "m6",
        sender: "contact",
        text: "See you then!",
        timestamp: "2023-11-10T10:20:00Z",
      },
    ],
  },
  {
    id: "2",
    lastMessage: "Got the files you sent. Thanks!",
    timestamp: "2023-11-09T14:15:00Z",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    phoneNumber: "+1 (555) 234-5678",
    messages: [
      {
        id: "m1",
        sender: "self",
        text: "Sent over the files you requested.",
        timestamp: "2023-11-09T14:00:00Z",
      },
      {
        id: "m2",
        sender: "contact",
        text: "Got the files you sent. Thanks!",
        timestamp: "2023-11-09T14:15:00Z",
      },
    ],
  },
  {
    id: "3",
    lastMessage: "Can we reschedule our meeting to next week?",
    timestamp: "2023-11-08T11:15:00Z",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    phoneNumber: "+1 (555) 345-6789",
    messages: [
      {
        id: "m1",
        sender: "contact",
        text: "Can we reschedule our meeting to next week?",
        timestamp: "2023-11-08T11:15:00Z",
      },
      {
        id: "m2",
        sender: "self",
        text: "Sure, let me check my schedule.",
        timestamp: "2023-11-08T11:20:00Z",
      },
    ],
  },
  {
    id: "4",
    lastMessage: "Let’s catch up over coffee soon!",
    timestamp: "2023-11-07T08:00:00Z",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    phoneNumber: "+1 (555) 456-7890",
    messages: [
      {
        id: "m1",
        sender: "contact",
        text: "Let’s catch up over coffee soon!",
        timestamp: "2023-11-07T08:00:00Z",
      },
      {
        id: "m2",
        sender: "self",
        text: "Sounds great! When are you free?",
        timestamp: "2023-11-07T08:05:00Z",
      },
    ],
  },
  {
    id: "5",
    lastMessage: "Hey! Just checking in. How have you been?",
    timestamp: "2023-11-06T16:45:00Z",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    phoneNumber: "+1 (555) 567-8901",
    messages: [
      {
        id: "m1",
        sender: "contact",
        text: "Hey! Just checking in. How have you been?",
        timestamp: "2023-11-06T16:45:00Z",
      },
      {
        id: "m2",
        sender: "self",
        text: "I've been good! How about you?",
        timestamp: "2023-11-06T16:50:00Z",
      },
    ],
  },
  {
    id: "6",
    lastMessage: "Don’t forget about our presentation tomorrow.",
    timestamp: "2023-11-05T13:20:00Z",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
    phoneNumber: "+1 (555) 678-9012",
    messages: [
      {
        id: "m1",
        sender: "self",
        text: "I'll finalize the slides tonight.",
        timestamp: "2023-11-05T12:00:00Z",
      },
      {
        id: "m2",
        sender: "contact",
        text: "Don’t forget about our presentation tomorrow.",
        timestamp: "2023-11-05T13:20:00Z",
      },
    ],
  },
  {
    id: "7",
    lastMessage: "Happy Birthday! Hope you’re having a great day!",
    timestamp: "2023-11-04T09:30:00Z",
    avatar: "https://randomuser.me/api/portraits/women/7.jpg",
    phoneNumber: "+1 (555) 789-0123",
    messages: [
      {
        id: "m1",
        sender: "contact",
        text: "Happy Birthday! Hope you’re having a great day!",
        timestamp: "2023-11-04T09:30:00Z",
      },
      {
        id: "m2",
        sender: "self",
        text: "Thank you so much!",
        timestamp: "2023-11-04T09:35:00Z",
      },
    ],
  },
  {
    id: "8",
    lastMessage: "I’ll send you the report by end of day.",
    timestamp: "2023-11-03T17:10:00Z",
    avatar: "https://randomuser.me/api/portraits/men/8.jpg",
    phoneNumber: "+1 (555) 890-1234",
    messages: [
      {
        id: "m1",
        sender: "contact",
        text: "I’ll send you the report by end of day.",
        timestamp: "2023-11-03T17:10:00Z",
      },
      {
        id: "m2",
        sender: "self",
        text: "Great, thank you!",
        timestamp: "2023-11-03T17:15:00Z",
      },
    ],
  },
  {
    id: "9",
    lastMessage: "Are we still meeting at the usual spot?",
    timestamp: "2023-11-02T07:45:00Z",
    avatar: "https://randomuser.me/api/portraits/women/9.jpg",
    phoneNumber: "+1 (555) 901-2345",
    messages: [
      {
        id: "m1",
        sender: "contact",
        text: "Are we still meeting at the usual spot?",
        timestamp: "2023-11-02T07:45:00Z",
      },
      {
        id: "m2",
        sender: "self",
        text: "Yes, see you there!",
        timestamp: "2023-11-02T07:50:00Z",
      },
    ],
  },
  {
    id: "10",
    lastMessage: "Just submitted the project. Let me know your thoughts!",
    timestamp: "2023-11-01T15:00:00Z",
    avatar: "https://randomuser.me/api/portraits/men/10.jpg",
    phoneNumber: "+1 (555) 012-3456",
    messages: [
      {
        id: "m1",
        sender: "contact",
        text: "Just submitted the project. Let me know your thoughts!",
        timestamp: "2023-11-01T15:00:00Z",
      },
      {
        id: "m2",
        sender: "self",
        text: "Will review and get back to you shortly.",
        timestamp: "2023-11-01T15:10:00Z",
      },
    ],
  },
  {
    id: "11",
    lastMessage: "We should plan a trip together soon!",
    timestamp: "2023-10-31T18:45:00Z",
    avatar: "https://randomuser.me/api/portraits/women/11.jpg",
    phoneNumber: "+1 (555) 123-4568",
    messages: [
      {
        id: "m1",
        sender: "contact",
        text: "We should plan a trip together soon!",
        timestamp: "2023-10-31T18:45:00Z",
      },
      {
        id: "m2",
        sender: "self",
        text: "Yes! Let’s start planning.",
        timestamp: "2023-10-31T18:50:00Z",
      },
    ],
  },
  {
    id: "12",
    lastMessage: "Thanks for the help on the assignment!",
    timestamp: "2023-10-30T14:20:00Z",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    phoneNumber: "+1 (555) 234-5679",
    messages: [
      {
        id: "m1",
        sender: "contact",
        text: "Thanks for the help on the assignment!",
        timestamp: "2023-10-30T14:20:00Z",
      },
      {
        id: "m2",
        sender: "self",
        text: "Anytime, glad to help!",
        timestamp: "2023-10-30T14:25:00Z",
      },
    ],
  },
  {
    id: "13",
    lastMessage: "Let’s get dinner sometime next week.",
    timestamp: "2023-10-29T12:15:00Z",
    avatar: "https://randomuser.me/api/portraits/women/13.jpg",
    phoneNumber: "+1 (555) 345-6780",
    messages: [
      {
        id: "m1",
        sender: "contact",
        text: "Let’s get dinner sometime next week.",
        timestamp: "2023-10-29T12:15:00Z",
      },
      {
        id: "m2",
        sender: "self",
        text: "I'd love to! Let’s set a date.",
        timestamp: "2023-10-29T12:20:00Z",
      },
    ],
  },
  {
    id: "14",
    lastMessage: "Good luck on your exam tomorrow!",
    timestamp: "2023-10-28T11:50:00Z",
    avatar: "https://randomuser.me/api/portraits/men/14.jpg",
    phoneNumber: "+1 (555) 456-7891",
    messages: [
      {
        id: "m1",
        sender: "contact",
        text: "Good luck on your exam tomorrow!",
        timestamp: "2023-10-28T11:50:00Z",
      },
      {
        id: "m2",
        sender: "self",
        text: "Thanks! I appreciate it.",
        timestamp: "2023-10-28T11:55:00Z",
      },
    ],
  },
  {
    id: "15",
    lastMessage: "Just saw your message. Let’s chat later!",
    timestamp: "2023-10-27T19:30:00Z",
    avatar: "https://randomuser.me/api/portraits/women/15.jpg",
    phoneNumber: "+1 (555) 567-8902",
    messages: [
      {
        id: "m1",
        sender: "self",
        text: "Let’s chat soon!",
        timestamp: "2023-10-27T19:00:00Z",
      },
      {
        id: "m2",
        sender: "contact",
        text: "Just saw your message. Let’s chat later!",
        timestamp: "2023-10-27T19:30:00Z",
      },
    ],
  },
];
