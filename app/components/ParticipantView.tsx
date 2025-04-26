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
  const { webcamStream, webcamOn } = useParticipant(participantId);
  const [predictions, setPredictions] = useState([]);

  // Function to fetch the local IP from the Python server
  async function fetchLocalIPAndHeaders() {
    try {
      const response = await fetch(
        'https://robust-hen-big.ngrok-free.app/local-ip'
      );
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }

      // Get the JSON body
      const data = await response.json();

      // Get specific headers
      const contentType = response.headers.get('content-type');
      const date = response.headers.get('date');
      const server = response.headers.get('server');
      const ngrokAgentIps = response.headers.get('ngrok-agent-ips');

      return { data, contentType, date, server, ngrokAgentIps };
    } catch (error) {
      return null;
    }
  }

  // Monitor predictions changes
  useEffect(() => {
    // console.log('Predictions updated:', predictions);
  }, [predictions]);

  // Updated WebSocket connection setup using ngrokAgentIps from fetchLocalIPAndHeaders
  useEffect(() => {
    let ws: WebSocket | null = null;
    async function setupWebSocket() {
      const result = await fetchLocalIPAndHeaders();
      if (!result) {
        // console.error('Could not fetch local IP and headers');
        return;
      }
      const { ngrokAgentIps } = result;
      if (!ngrokAgentIps) {
        // console.error('ngrokAgentIps not found');
        return;
      }
      // console.log('Using ngrokAgentIps:', ngrokAgentIps);
      // Use the fetched ngrokAgentIps in the WebSocket URL
      ws = new WebSocket(`ws://${ngrokAgentIps}:8888`);

      ws.onopen = () => {
        // console.log('WebSocket Connected!');
      };
      ws.onmessage = (event) => {
        // console.log('Received message:', event.data);
        try {
          const response = JSON.parse(event.data);
          // console.log('Parsed response:', response);
          if (response.status === 'success') {
            // console.log('Setting predictions:', response.predictions);
            setPredictions(response.predictions);
          }
        } catch (error) {
          // console.error('Error parsing WebSocket message:', error);
        }
      };
      ws.onerror = (_error) => {
        // console.error('WebSocket error:', error);
      };
      ws.onclose = (_event) => {
        // console.log('WebSocket closed:', event.code, event.reason);
      };
    }
    setupWebSocket();
    return () => {
      // console.log('Cleaning up WebSocket connection...');
      ws?.close();
    };
  }, []);

  return webcamOn && webcamStream ? (
    <View style={{ ...style }}>
      <RTCView
        zOrder={zOrder}
        streamURL={new MediaStream([webcamStream.track]).toURL()}
        objectFit="cover"
        style={{ height: '100%', width: '100%' }}
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
