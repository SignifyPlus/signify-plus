import { archiveChat } from '@/api/chat/archive-chat-mutation';
import { deleteChat } from '@/api/chat/delete-chat-mutation';
import { pinChat } from '@/api/chat/prin-chat-mutation';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { Component, PropsWithChildren } from 'react';
import {
  Alert,
  Animated,
  I18nManager,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

export class AppleStyleSwipeableRow extends Component<
  PropsWithChildren<{
    chatId: string;
    userPhoneNumber: string;
    isArchived: boolean;
    isPinned: boolean;
  }>
> {
  private renderRightAction = (
    text: string,
    color: string,
    x: number,
    progress: Animated.AnimatedInterpolation<number>
  ) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });

    const pressHandler = () => {
      this.close();
      if (text === 'Delete') {
        Alert.alert(text, 'Are you sure you want to delete?', [
          { text: 'No', onPress: () => {}, style: 'cancel' },
          {
            text: 'Yes',
            onPress: () => {
              deleteChat({
                userPhoneNumber: this.props.userPhoneNumber,
                chatId: this.props.chatId,
              }).catch((err) => {
                Alert.alert('Deleting chat failed', err.toString());
              });
            },
            style: 'destructive',
          },
        ]);
      }

      if (text === 'Archive' || text === 'Unarchive') {
        archiveChat({
          userPhoneNumber: this.props.userPhoneNumber,
          chatId: this.props.chatId,
          isArchived: !this.props.isArchived,
        })
          .then(() => {
            Alert.alert(
              text === 'Unarchive' ? 'Chat unarchived' : 'Chat archived',
              `Chat ${text.toLowerCase()}d successfully`
            );
          })
          .catch((err) => {
            Alert.alert(`${text} chat failed`, err.toString());
          });
      }
    };

    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={pressHandler}
        >
          <Ionicons
            name={
              text === 'Archive' || text === 'Unarchive' ? 'archive' : 'trash'
            }
            size={24}
            color="#fff"
            style={{ paddingTop: 10 }}
          />
          <Text style={styles.actionText}>{text}</Text>
        </RectButton>
      </Animated.View>
    );
  };

  private renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    _dragAnimatedValue: Animated.AnimatedInterpolation<number>
  ) => (
    <View
      style={{
        width: 192,
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      }}
    >
      {this.renderRightAction(
        this.props.isArchived ? 'Unarchive' : 'Archive',
        Colors.muted,
        192,
        progress
      )}
      {this.renderRightAction('Delete', Colors.red, 128, progress)}
    </View>
  );

  private renderLeftAction = (
    progress: Animated.AnimatedInterpolation<number>
  ) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [-64, 0],
    });

    const isPinned = this.props.isPinned;
    const actionText = isPinned ? 'Unpin' : 'Pin';
    const iconName = isPinned ? 'close-circle' : 'pin';

    const pressHandler = () => {
      this.close();
      pinChat({
        userPhoneNumber: this.props.userPhoneNumber,
        chatId: this.props.chatId,
        isPinned: !isPinned,
      })
        .then(() => {
          Alert.alert(
            `${actionText}ned`,
            `Chat ${actionText.toLowerCase()}ned successfully`
          );
        })
        .catch((err) => {
          Alert.alert(`${actionText}ning chat failed`, err.toString());
        });
    };

    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.leftAction, { backgroundColor: Colors.primary }]}
          onPress={pressHandler}
        >
          <Ionicons
            name={iconName}
            size={24}
            color="#fff"
            style={{ paddingTop: 10 }}
          />
          <Text style={styles.actionText}>{actionText}</Text>
        </RectButton>
      </Animated.View>
    );
  };

  private renderLeftActions = (
    progress: Animated.AnimatedInterpolation<number>,
    _dragAnimatedValue: Animated.AnimatedInterpolation<number>
  ) => (
    <View
      style={{
        width: 64,
        flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
      }}
    >
      {this.renderLeftAction(progress)}
    </View>
  );

  private swipeableRow?: Swipeable;

  private updateRef = (ref: Swipeable) => {
    this.swipeableRow = ref;
  };

  private close = () => {
    this.swipeableRow?.close();
  };

  override render() {
    const { children } = this.props;
    return (
      <Swipeable
        ref={this.updateRef}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={this.renderRightActions}
        renderLeftActions={this.renderLeftActions}
      >
        {children}
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  leftAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
