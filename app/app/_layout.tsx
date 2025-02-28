import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Link, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AppProvider } from '@/context/app-context';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

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
          name="(modals)/new-chat"
          options={{
            presentation: 'modal',
            title: 'New Chat',
            headerTransparent: true,
            headerBlurEffect: 'regular',
            headerStyle: {
              backgroundColor: Colors.background,
            },
            headerRight: () => (
              <Link href={'/(tabs)/chats'} asChild>
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.lightGray,
                    borderRadius: 20,
                    padding: 4,
                  }}
                >
                  <Ionicons name="close" color={Colors.gray} size={30} />
                </TouchableOpacity>
              </Link>
            ),
            headerSearchBarOptions: {
              placeholder: 'Search name or number',
              hideWhenScrolling: false,
            },
          }}
        />
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
