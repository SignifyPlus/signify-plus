import { useAppContext } from '@/context/app-context';
import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { ControlsContainer } from '@/components/ControlsContainer';

export const Ringing = () => {
  const { incomingCallUser } = useAppContext();

  const user =
    typeof incomingCallUser === 'string'
      ? incomingCallUser
      : (incomingCallUser?.displayName ?? 'Unknown Caller');

  const initial =
    typeof incomingCallUser === 'string'
      ? 'A'
      : incomingCallUser?.displayName.charAt(0);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#1a1a1a',
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 50,
        }}
      >
        <View
          style={{
            alignItems: 'center',
            marginTop: 50,
          }}
        >
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: '#404040',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 40,
                color: 'white',
              }}
            >
              {initial}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 10,
            }}
          >
            {user ?? 'Unknown Caller'}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: '#cccccc',
            }}
          >
            Ringing...
          </Text>
        </View>

        <ControlsContainer hideVideo />
      </View>
    </SafeAreaView>
  );
};