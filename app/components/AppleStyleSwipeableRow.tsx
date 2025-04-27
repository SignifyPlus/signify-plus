import { archiveChat } from '@/api/chat/archive-chat-mutation';
import { deleteChat } from '@/api/chat/delete-chat-mutation';
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
  PropsWithChildren<{ chatId: string }>
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
          {
            text: 'No',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => {
              deleteChat(this.props.chatId).catch((err) => {
                Alert.alert('Deleting chat failed', err.toString());
              });
            },
            style: 'destructive',
          },
        ]);
      }

      if (text === 'Archive') {
        archiveChat(this.props.chatId).catch((err) => {
          Alert.alert('Archive chat failed', err.toString());
        });
      }

      // eslint-disable-next-line no-alert
      // window.alert(text);
    };

    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={pressHandler}
        >
          <Ionicons
            name={text === 'Archive' ? 'archive' : 'trash'}
            size={24}
            color={'#fff'}
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
      {this.renderRightAction('Archive', Colors.muted, 192, progress)}
      {this.renderRightAction('Delete', Colors.red, 128, progress)}
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
});
