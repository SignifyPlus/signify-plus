import Colors from '@/constants/Colors';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {
  activateUserSessionAfterSignIn,
  activateUserSessionAfterSignUp,
  attemptFirstFactorVerificationForSignIn,
  attemptPhoneNumberVerificationForSignUp,
  resendSignInVerificationCode,
  resendSignUpVerificationCode,
} from '@/api';
import { useAppContext } from '@/context/app-context';

const CELL_COUNT = 6;

const Page = () => {
  const { phone, signin } = useLocalSearchParams<{
    phone: string;
    signin: string;
  }>();
  const router = useRouter();
  const [code, setCode] = useState('');
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 90 : 0;
  const { setPhoneNumber } = useAppContext();

  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  const handleSignUpVerification = useCallback(async () => {
    try {
      await attemptPhoneNumberVerificationForSignUp(code);
      await activateUserSessionAfterSignUp();
    } catch (err) {
      console.log('error', JSON.stringify(err, null, 2));
      Alert.alert(
        'Error',
        'An error occurred during verification. Please try again.'
      );
    }
  }, [code]);

  const handleSignInVerification = useCallback(async () => {
    try {
      await attemptFirstFactorVerificationForSignIn(code);
      await activateUserSessionAfterSignIn();
      console.log('signin comeplete', code);
    } catch (err) {
      console.log('error', JSON.stringify(err, null, 2));
      Alert.alert(
        'Error',
        'An error occurred during verification. Please try again.'
      );
    }
  }, [code]);

  const handleResendCode = useCallback(async () => {
    try {
      if (signin === 'true') {
        await resendSignInVerificationCode(phone);
      } else {
        await resendSignUpVerificationCode(phone);
        // createUser({
        //   name: 'test',
        //   phoneNumber: phone,
        //   password: 'test',
        // });
      }
    } catch (err) {
      console.log('error', JSON.stringify(err, null, 2));
      Alert.alert(
        'Error',
        'An error occurred while resending the verification code. Please try again.'
      );
    }
  }, [phone, signin]);

  useEffect(() => {
    if (code.length === 6) {
      // console.log('verify', code);

      if (signin === 'true') {
        // console.log('signin');
        handleSignInVerification();
      } else {
        handleSignUpVerification();
        // createUser({ name: 'test', phoneNumber: phone, password: 'test' });
      }
      router.replace('/(tabs)/chats');
    }
  }, [
    code,
    handleSignInVerification,
    handleSignUpVerification,
    router,
    signin,
  ]);

  useEffect(() => {
    console.log('phoneneee', phone);
    setPhoneNumber(phone);
  }, [setPhoneNumber, phone]);

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={{ flex: 1 }}
      behavior="padding"
    >
      <View style={styles.container}>
        <Stack.Screen options={{ title: phone }} />
        <Text style={styles.legal}>
          We have sent you an SMS with a code to the number above.
        </Text>
        <Text style={styles.legal}>
          To complete your phone number verification, please enter the 6-digit
          activation code.
        </Text>

        <CodeField
          ref={ref}
          {...props}
          value={code}
          onChangeText={setCode}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoFocus
          renderCell={({ index, symbol, isFocused }) => (
            <View
              onLayout={getCellOnLayoutHandler(index)}
              key={index}
              style={[styles.cellRoot, isFocused && styles.focusCell]}
            >
              <Text style={styles.cellText}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )}
        />

        <TouchableOpacity style={styles.button} onPress={handleResendCode}>
          <Text style={styles.buttonText}>
            Didn&#39;t receive a verification code?
          </Text>
        </TouchableOpacity>
      </View>
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
  legal: {
    fontSize: 14,
    textAlign: 'center',
    color: '#000',
  },
  button: {
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.primary,
    fontSize: 18,
  },
  codeFieldRoot: {
    marginTop: 20,
    width: 260,
    marginLeft: 'auto',
    marginRight: 'auto',
    gap: 4,
  },
  cellRoot: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  cellText: {
    color: '#000',
    fontSize: 36,
    textAlign: 'center',
  },
  focusCell: {
    paddingBottom: 4,
    borderBottomColor: '#000',
    borderBottomWidth: 2,
  },
});

export default Page;
