import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaskInput from 'react-native-mask-input';
import {
  createSignInSession,
  prepareFirstFactorVerification,
  preparePhoneVerification,
  signUpWithPhoneNumber,
} from '../api';

// const TUR_PHONE = [
//   `+`,
//   '9',
//   '0',
//   ' ',
//   /\d/,
//   /\d/,
//   /\d/,
//   ' ',
//   /\d/,
//   /\d/,
//   ' ',
//   /\d/,
//   /\d/,
// ];

const Page = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const openLink = () => {
    Linking.openURL('https://google.com');
  };

  const sendOTP = async () => {
    // console.log("sendOTP", phoneNumber);
    setLoading(true);

    try {
      await signUpWithPhoneNumber(phoneNumber);
      // console.log("After create");

      await preparePhoneVerification();

      // console.log("After prepare");
      router.push(`/verify/${phoneNumber}`);
    } catch (error) {
      const err = error as Error;
      // console.log("error", JSON.stringify(err, null, 2));

      // Check if the error is a "user already signed up" case
      if (err.message.includes('form_identifier_exists')) {
        // console.log("User signed up before, trying sign-in.");
        await trySignIn();
      } else {
        setLoading(false);
        Alert.alert('Error', 'An error occurred during sign-up.');
      }
    }
  };

  const trySignIn = async () => {
    // console.log("trySignIn", phoneNumber);

    const { supportedFirstFactors } = await createSignInSession(phoneNumber);

    const firstPhoneFactor: any = supportedFirstFactors.find((factor: any) => {
      return factor.strategy === 'phone_code';
    });

    const { phoneNumberId } = firstPhoneFactor;

    await prepareFirstFactorVerification({
      strategy: 'phone_code',
      phoneNumberId,
    });

    router.push(`/verify/${phoneNumber}`);
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : undefined}
      style={{ flex: 1 }}
      behavior="padding"
    >
      {loading ? (
        <View style={[StyleSheet.absoluteFill, styles.loading]}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ fontSize: 18, padding: 10 }}>Sending code...</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.description}>
            WhatsApp will need to verify your account. Carrier charges may
            apply.
          </Text>

          <View style={styles.list}>
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>Turkey</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </View>
            <View style={styles.separator} />

            <MaskInput
              value={phoneNumber}
              keyboardType="numeric"
              autoFocus
              placeholder="+90 your phone number"
              onChangeText={(masked, _unmasked) => {
                setPhoneNumber(masked);
              }}
              // mask={TUR_PHONE}
              style={styles.input}
            />
          </View>

          <Text style={styles.legal}>
            You must be{' '}
            <Text style={styles.link} onPress={openLink}>
              at least 16 years old
            </Text>{' '}
            to register. Learn how WhatsApp works with the{' '}
            <Text style={styles.link} onPress={openLink}>
              Meta Companies
            </Text>
            .
          </Text>

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            style={[
              styles.button,
              phoneNumber !== '' ? styles.enabled : null,
              { marginBottom: 20 },
            ]}
            onPress={sendOTP}
          >
            <Text
              style={[
                styles.buttonText,
                phoneNumber !== '' ? styles.enabled : null,
              ]}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background,
    gap: 20,
  },
  description: {
    fontSize: 14,
    color: Colors.gray,
  },
  legal: {
    fontSize: 12,
    textAlign: 'center',
    color: '#000',
  },
  link: {
    color: Colors.primary,
  },
  button: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    padding: 10,
    borderRadius: 10,
  },
  enabled: {
    backgroundColor: Colors.primary,
    color: '#fff',
  },
  buttonText: {
    color: Colors.gray,
    fontSize: 22,
    fontWeight: '500',
  },
  list: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 10,
    padding: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 6,
    marginBottom: 10,
  },
  listItemText: {
    fontSize: 18,
    color: Colors.primary,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.gray,
    opacity: 0.2,
  },
  input: {
    backgroundColor: '#fff',
    width: '100%',
    fontSize: 16,
    padding: 6,
    marginTop: 10,
  },

  loading: {
    zIndex: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Page;
