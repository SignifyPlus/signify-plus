import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

const formatTime = (time: number) => time.toString().padStart(2, '0');

export const Timer = ({ color }: { color: string }) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(secondsElapsed / 3600);
  const minutes = Math.floor((secondsElapsed % 3600) / 60);
  const seconds = secondsElapsed % 60;

  return (
    <View style={styles.container}>
      <Text style={{ ...styles.timeText, color }}>
        {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100000,
  },
  timeText: {
    fontSize: 16,
    color: '#cccccc',
  },
});
