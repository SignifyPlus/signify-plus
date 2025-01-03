import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface GesturePrediction {
  gesture: string;
  confidence: number;
}

interface GestureOverlayProps {
  predictions: GesturePrediction[];
}

const GestureOverlay: React.FC<GestureOverlayProps> = ({ predictions }) => {
  return (
    <View style={styles.overlay}>
      {predictions.slice(0, 3).map((prediction, index) => (
        <View 
          key={index} 
          style={[
            styles.predictionContainer,
            { backgroundColor: `rgba(17, 120, 248, ${0.9 - index * 0.2})` }
          ]}
        >
          <Text style={styles.gestureText}>
            {prediction.gesture.toUpperCase()}
          </Text>
          <Text style={styles.confidenceText}>
            {(prediction.confidence * 100).toFixed(1)}%
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1000,
  },
  predictionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    marginBottom: 5,
    borderRadius: 4,
    minWidth: 150,
  },
  gestureText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  confidenceText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 10,
  },
});

export default GestureOverlay;