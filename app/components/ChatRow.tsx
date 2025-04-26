import { AppleStyleSwipeableRow } from '@/components/AppleStyleSwipeableRow';
import Colors from '@/constants/Colors';
import { format } from 'date-fns';
import { Link } from 'expo-router';
import { FC } from 'react';
import { Text, TouchableHighlight, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface ChatRowProps {
  id: string;
  from: string;
  date: string;
  img: string;
  msg: string;
  read: boolean;
  unreadCount: number;
}

export const ChatRow: FC<ChatRowProps> = ({
  id,
  from,
  date,
  img,
  msg,
  // read,
  // unreadCount,
}) => {
  const message = msg.split('\n')[msg.split('\n').length - 1];

  return (
    <AppleStyleSwipeableRow>
      <Link href={`/(tabs)/chats/${id}`} asChild>
        <TouchableHighlight
          activeOpacity={0.8}
          underlayColor={Colors.lightGray}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              paddingLeft: 20,
              paddingVertical: 10,
            }}
          >
            {img ? (
              <Image
                source={{ uri: img }}
                style={{ width: 50, height: 50, borderRadius: 50 }}
              />
            ) : (
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  backgroundColor: Colors.lightGray,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="person-outline" />
              </View>
            )}

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{from}</Text>
              <Text style={{ fontSize: 16, color: Colors.gray }}>
                {(message || msg).length > 40
                  ? `${(message || msg).substring(0, 40)}...`
                  : message || msg}
              </Text>
            </View>
            <Text
              style={{
                color: Colors.gray,
                paddingRight: 20,
                alignSelf: 'flex-start',
              }}
            >
              {format(date, 'MM.dd.yy')}
            </Text>
          </View>
        </TouchableHighlight>
      </Link>
    </AppleStyleSwipeableRow>
  );
};
