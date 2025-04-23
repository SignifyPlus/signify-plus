import {
  Button,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { usePathname, useRouter } from 'expo-router';

export const PhoneSignIn = () => {
  const pathname = usePathname();
  const router = useRouter();
  console.log('auth', auth().currentUser);
  useEffect(() => {
    console.log('auth', auth().currentUser);
  }, []);

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (pathname == '/firebaseauth/link') router.back();
  }, [pathname]);

  // Handle the button press
  async function signInWithPhoneNumber(phoneNumber: string) {
    try {
      console.log('phoneNumber', phoneNumber);
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      console.log('confirmation', confirmation);
      setConfirm(confirmation);
    } catch (error) {
      console.error(error);
    }
  }

  async function confirmCode() {
    try {
      await confirm.confirm(code);
    } catch (error) {
      console.log('Invalid code.');
    }
  }

  if (initializing) return null;

  if (!user) {
    if (!confirm) {
      return (
        <SafeAreaView style={{ marginBottom: 30 }}>
          <TouchableOpacity
            onPress={() => signInWithPhoneNumber('+905313913493')}
            style={{ borderColor: 'red', borderWidth: 1, marginTop: 100 }}
          >
            <Text>Sign In</Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView>
        <TextInput
          value={code}
          onChangeText={(text) => setCode(text)}
          style={{ borderColor: 'red', borderWidth: 1 }}
        />
        <Button title="Confirm Code" onPress={() => confirmCode()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <Text>Welcome {user.email}</Text>
      <Button title="Sign Out" onPress={() => auth().signOut()} />
    </SafeAreaView>
  );
};
