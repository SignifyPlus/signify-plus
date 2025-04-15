import {
  MediaStream,
  RTCView,
  useParticipant,
} from '@videosdk.live/react-native-sdk';
import React, { useEffect, useState } from 'react';
import GestureOverlay from './GestureOverlay';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { ML_WEBSOCKET_URL,  } from '@/constants/Config';

interface ParticipantViewProps {
  participantId: string;
  style?: any;
  zOrder?: number;
}

export const ParticipantView: React.FC<ParticipantViewProps> = ({
  participantId,
  style,
  zOrder,
}) => {
  const { webcamStream, webcamOn, displayName } = useParticipant(participantId);
  const [predictions, setPredictions] = useState([]);

   // Skip rendering AI_MODEL participants
   if (displayName === 'AI_MODEL') {
    return null;
  }

  // Monitor predictions changes
  useEffect(() => {
    // console.log('Predictions updated:', predictions);
  }, [predictions]);

   // Set up WebSocket connection for predictions
   useEffect(() => {
    const ws = new WebSocket(ML_WEBSOCKET_URL);
    ws.onopen = () => {
      console.log('WebSocket Connected!');
    };
    ws.onmessage = (event) => {
      // console.log('Received message:', event.data);
      try {
        const response = JSON.parse(event.data);
        // console.log('Parsed response:', response);
        if (response.status === 'success') {
          console.log('Setting predictions:', response.predictions);
          setPredictions(response.predictions);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
    };
    return () => {
      console.log('Cleaning up WebSocket connection...');
      ws.close();
    };
  }, []);

  return webcamOn && webcamStream ? (
    <View style={{ ...style }}>
      <RTCView
        zOrder={zOrder}
        streamURL={new MediaStream([webcamStream.track]).toURL()}
        objectFit="cover"
        style={{ height: '100%', width: '100%' }}
        mirror={true}
      />
      <GestureOverlay predictions={predictions} />
    </View>
  ) : (
    <View
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Ionicons name="videocam-off-outline" size={32} color={Colors.primary} />
    </View>
  );
};
