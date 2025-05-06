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
import { deleteCallLog } from '@/api/call/delete-call-mutation';

export class CallLogItemAppleStyleSwipeableRow extends Component<
  PropsWithChildren<{
    callId: string;
    userPhoneNumber: string;
  }>
> {
  private swipeableRow?: Swipeable;

  private updateRef = (ref: Swipeable) => {
    this.swipeableRow = ref;
  };

  private close = () => {
    this.swipeableRow?.close();
  };

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
        Alert.alert(
          'Delete Call',
          'Are you sure you want to delete this call?',
          [
            { text: 'No', onPress: () => {}, style: 'cancel' },
            {
              text: 'Yes',
              onPress: () => {
                deleteCallLog({
                  phoneNumber: this.props.userPhoneNumber,
                  callHistoryLogIds: [this.props.callId],
                }).catch((err) => {
                  Alert.alert('Deleting call failed', err.toString());
                });
              },
              style: 'destructive',
            },
          ]
        );
      }
    };

    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={pressHandler}
        >
          <Ionicons
            name="trash"
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
        width: 96,
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      }}
    >
      {this.renderRightAction('Delete', Colors.red, 96, progress)}
    </View>
  );

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
