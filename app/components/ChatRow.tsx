import { AppleStyleSwipeableRow } from '@/components/AppleStyleSwipeableRow';
import Colors from '@/constants/Colors';
import { format } from 'date-fns';
import { Link } from 'expo-router';
import { FC, Fragment, useState } from 'react';
import {
  Text,
  TouchableHighlight,
  View,
  Image,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '@/context/app-context';

export interface ChatRowProps {
  id: string;
  from: string;
  date: string;
  img: string;
  msg: string;
  read: boolean;
  unreadCount: number;
  isArchived?: boolean;
  isPinned?: boolean;
  pinnedBy?: string[];
}

export const ChatRow: FC<ChatRowProps> = ({
  id,
  from,
  date,
  img,
  msg,
  isArchived = false,
  isPinned = false,
}) => {
  const { phoneNumber } = useAppContext();
  const message = msg.split('\n')[msg.split('\n').length - 1];

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <Fragment>
      <AppleStyleSwipeableRow
        chatId={id}
        userPhoneNumber={phoneNumber!}
        isArchived={isArchived}
        isPinned={isPinned}
      >
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
                <Pressable onPress={() => setModalVisible(true)}>
                  <Image
                    source={{ uri: img }}
                    style={{ width: 50, height: 50, borderRadius: 50 }}
                  />
                </Pressable>
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

              <View
                style={{
                  paddingRight: 20,
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  height: 50,
                }}
              >
                <Text style={{ color: Colors.gray }}>
                  {format(date, 'MM.dd.yy')}
                </Text>
                {isPinned && (
                  <Ionicons
                    name="pin"
                    size={16}
                    color={Colors.gray}
                    style={{ marginTop: 4 }}
                  />
                )}
              </View>
            </View>
          </TouchableHighlight>
        </Link>
      </AppleStyleSwipeableRow>

      {img && (
        <Modal visible={modalVisible} transparent>
          <View style={styles.modalContainer}>
            <Image
              source={{ uri: img }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={32} color="white" />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
  },
});
