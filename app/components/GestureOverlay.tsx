import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const GestureOverlay = ({ predictions }) => {
  const [currentGesture, setCurrentGesture] = useState('');
  const [opacity] = useState(new Animated.Value(0));
  
  // Clear the display after this many milliseconds with no new predictions
  const CLEAR_TIMEOUT = 500; // Reduced from 2000ms to 500ms for faster clearing
  const [clearTimer, setClearTimer] = useState(null);
  
  useEffect(() => {
    // Check if we got empty predictions or no predictions
    if (!predictions || predictions.length === 0) {
      // Don't immediately clear - set a timeout to clear if no new predictions come in
      if (!clearTimer) {
        const timer = setTimeout(() => {
          // Clear the gesture after timeout
          setCurrentGesture('');
          // Fade out animation
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
          }).start();
        }, CLEAR_TIMEOUT);
        
        setClearTimer(timer);
      }
      return;
    }
    
    // If we have predictions, clear any pending clear timers
    if (clearTimer) {
      clearTimeout(clearTimer);
      setClearTimer(null);
    }
    
    // Get the top prediction (highest confidence)
    const gesture = predictions[0]?.gesture || '';
    
    // Only update if it's different (reduces unnecessary re-renders)
    if (gesture !== currentGesture) {
      setCurrentGesture(gesture);
      
      // Set immediately visible with minimal animation
      opacity.setValue(0.5);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 100, // Reduced from 300ms to 100ms
        useNativeDriver: true
      }).start();
    }
  }, [predictions]);
  
  // Don't render anything if there's no gesture
  if (!currentGesture) return null;
  
  return (
    <Animated.View style={[styles.overlay, { opacity }]}>
      <View style={styles.gestureContainer}>
        <Text style={styles.gestureText}>{currentGesture}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'transparent', // No background overlay
  },
  gestureContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  gestureText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default GestureOverlay;