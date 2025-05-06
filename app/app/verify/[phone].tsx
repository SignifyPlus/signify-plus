import Colors from '@/constants/Colors';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
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
import { useUserVerificationQuery } from '@/api/user/user-verification-query';
import { useGetOtpMutation } from '@/api/user/get-otp-mutation';
import { useVerifyOtpMutation } from '@/api/user/verify-otp-mutation';

const CELL_COUNT = 6;

const Page = () => {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const router = useRouter();
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(30);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 90 : 0;

  const {
    data: userVerification,
    isPending,
    isLoading,
  } = useUserVerificationQuery({
    phoneNumber: phone,
  });

  const { mutate: getOtpMutate } = useGetOtpMutation();
  const { mutate: verifyOtpMutate } = useVerifyOtpMutation();

  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  const startTimer = () => {
    setTimer(30);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (phone && userVerification?.isVerified === false) {
      getOtpMutate(phone);
      startTimer();
    }
    if (userVerification?.isVerified) {
      router.replace('/(tabs)/chats');
    }
  }, [
    getOtpMutate,
    phone,
    router,
    userVerification,
    userVerification?.isVerified,
  ]);

  useEffect(() => {
    if (code.length !== 6) return;

    verifyOtpMutate(
      {
        phoneNumber: phone,
        otpCode: code,
      },
      {
        onSuccess: (data) => {
          if (data.valid || data.status === 'success') {
            router.replace('/(tabs)/chats');
          }
        },
        onError: (err) => {
          Alert.alert(
            'Invalid code',
            'Please check the code and try again. ' + err.message
          );
        },
      }
    );
  }, [code, phone, router, verifyOtpMutate]);

  if (isPending || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!userVerification) {
    return (
      <View>
        <Text>Unable to find user verification</Text>
      </View>
    );
  }

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

        <TouchableOpacity
          style={[styles.button, timer > 0 && styles.disabledButton]}
          disabled={timer > 0}
          onPress={() => {
            getOtpMutate(phone, {
              onSuccess: () => {
                Alert.alert(
                  'Verification code sent',
                  'We have sent you a new verification code. Please check your SMS.'
                );
                startTimer();
              },
              onError: () => {
                Alert.alert(
                  'Error',
                  'Unable to send verification code. Please try again later.'
                );
              },
            });
          }}
        >
          <Text
            style={[styles.buttonText, timer > 0 && styles.disabledButtonText]}
          >
            {timer > 0
              ? `Resend available in ${timer}s`
              : "Didn't receive a verification code?"}
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
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    color: '#888',
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
    height: 60,
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
