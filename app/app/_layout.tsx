import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';
import { AppProvider } from '@/context/app-context';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // const router = useRouter();
  // useEffect(() => {
  //   // authorize user and replace
  //   setTimeout(() => {
  //     router.replace("/(tabs)/chats");
  //     // router.replace("/video-call");
  //   }, 1000);
  // }, [router]);

  if (!loaded) {
    return <View />;
  }

  return (
    <AppProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="otp"
          options={{
            headerTitle: 'Enter Your Phone Number',
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="verify/[phone]"
          options={{
            title: 'Verify Your Phone Number',
            headerShown: true,
            headerBackTitle: 'Edit number',
          }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="incoming-call"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </AppProvider>
  );
};

const RootLayoutNav = () => {
  return <InitialLayout />;
};

export default RootLayoutNav;
