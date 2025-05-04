import Colors from '@/constants/Colors';
import { Stack } from 'expo-router';
import { useAppContext } from '@/context/app-context';

const Layout = () => {
  const { setCallSearchQuery } = useAppContext();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Calls',
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
          headerSearchBarOptions: {
            placeholder: 'Search',
            onChangeText: (e) => {
              setCallSearchQuery(e.nativeEvent.text);
            },
          },
        }}
      />
    </Stack>
  );
};
export default Layout;
