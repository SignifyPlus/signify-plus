import { PageView } from "@/components/page-view/page-view";
import { View, Text, StyleSheet } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import { useEffect } from "react";

export default function VideoCall() {
  console.log("rendering VideoCall");

  const device = useCameraDevice("front");
  const { hasPermission, requestPermission } = useCameraPermission();

  console.log("device", hasPermission);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  if (device)
    return (
      <PageView>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              height: 200,
              width: 100,
              borderRadius: 10,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Camera
              style={{
                width: "100%",
                height: "100%",
              }}
              device={device}
              isActive={true}
            />
          </View>
        </View>
      </PageView>
    );

  return (
    <PageView>
      <View>
        <Text>No permission</Text>
      </View>
    </PageView>
  );
}
