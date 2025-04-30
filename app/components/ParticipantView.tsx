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
import { ML_WEBSOCKET_URL } from '@/constants/Config';

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

  // Set up WebSocket connection for predictions (simplified)
  useEffect(() => {
    let ws: WebSocket | null = null;
    let isConnecting = true;
    
    const connectToML = () => {
      if (!isConnecting) return;
      
      try {
        // Attempt to connect to ML server with timeout
        ws = new WebSocket(ML_WEBSOCKET_URL);
        
        // Set connection timeout
        const connectionTimeout = setTimeout(() => {
          if (ws && ws.readyState !== WebSocket.OPEN) {
            console.log('ML connection timeout (non-critical)');
            try {
              ws.close();
            } catch (e) {
              // Ignore cleanup errors
            }
            ws = null;
          }
        }, 3000); // 3 second timeout
        
        ws.onopen = () => {
          clearTimeout(connectionTimeout);
          console.log('ML connection established');
        };
        
        ws.onmessage = (event) => {
          try {
            const response = JSON.parse(event.data);
            if (response.status === 'success') {
              setPredictions(response.predictions);
            }
          } catch (error) {
            // Silently ignore parse errors
            console.log('Parse error (non-critical)');
          }
        };
        
        // Silent error handlers - just log and continue
        ws.onerror = () => {
          clearTimeout(connectionTimeout);
          console.log('ML connection error (non-critical)');
        };
        
        ws.onclose = () => {
          clearTimeout(connectionTimeout);
          console.log('ML connection closed (non-critical)');
        };
      } catch (error) {
        // Silently ignore connection errors
        console.log('ML connection failed (non-critical)');
      }
    };
    
    // Try to connect
    connectToML();
  
    // Clean up on unmount
    return () => {
      isConnecting = false;
      if (ws) {
        try {
          ws.close();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  // Render video component (core functionality)
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