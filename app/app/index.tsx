import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '@/constants/Colors';
import { Link, router } from 'expo-router';
import logoImage from '@/assets/images/logo.jpeg';
import { useLoginUserMutation, User } from '@/api/user/login-user-mutation';
import { useAppContext } from '@/context/app-context';
import {
  getAsyncStorageValue,
  setAsyncStorageValue,
} from '@/context/async-storage';
import { sanitizePhoneNumber } from '@/constants/utils';
import { Ionicons } from '@expo/vector-icons';
import PhoneInput from 'react-native-phone-number-input';
import { useUserVerificationMutation } from '@/api/user/user-verification-mutation';

const logo_image = Image.resolveAssetSource(logoImage).uri;

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isJwtChecked, setIsJwtChecked] = useState<
    'pending' | 'checked' | 'failed'
  >('pending');

  // Error states for validation
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');

  const { mutate, isPending } = useLoginUserMutation();
  const { setPhoneNumber: setPhoneNumberInContext, setUser } = useAppContext();
  const { mutateAsync: userVerificationMutate } = useUserVerificationMutation();

  const validatePhoneNumber = (number: string) => {
    // First check if empty
    if (!number.trim()) {
      setPhoneError('Phone number is required');
      return false;
    }

    // Check format: must be international format with country code
    const phoneRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    if (!phoneRegex.test(number)) {
      setPhoneError('Invalid phone number. Use format +491234567890');
      return false;
    }

    setPhoneError('');
    return true;
  };

  const validatePassword = (password: string) => {
    // Check if empty
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }

    // Check minimum length
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }

    setPasswordError('');
    return true;
  };

  // Only update state without validation on change
  const handlePhoneNumberChange = (text: string) => {
    setPhoneNumber(text);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
  };

  // Validate on blur
  const handlePhoneBlur = () => {
    validatePhoneNumber(phoneNumber);
  };

  const handlePasswordBlur = () => {
    validatePassword(password);
  };

  const handleLogin = () => {
    // Reset errors
    setLoginError('');

    // Validate both fields
    const isPhoneValid = validatePhoneNumber(phoneNumber);
    const isPasswordValid = validatePassword(password);

    if (!isPhoneValid || !isPasswordValid) {
      return;
    }

    const santizedPhoneNumber = sanitizePhoneNumber(phoneNumber);

    mutate(
      { phoneNumber: santizedPhoneNumber, password },
      {
        onSuccess: async (data) => {
          setUser(data);
          setPhoneNumberInContext(santizedPhoneNumber);
          await setAsyncStorageValue('user', JSON.stringify(data));
          if (data.userAuthenticationRecord?.isVerified) {
            router.replace(`/(tabs)/chats`);
          } else {
            router.replace(`/verify/${phoneNumber}`);
          }
        },
        onError: () => {
          setLoginError('Login failed. Please check your credentials.');
        },
      }
    );
  };

  const isInvalid =
    !phoneNumber || !password || !!phoneError || !!passwordError;

  useEffect(() => {
    (async () => {
      const user = await getAsyncStorageValue('user');
      if (user) {
        try {
          const parsedUser = JSON.parse(user) as User;
          const result = await userVerificationMutate({
            phoneNumber: parsedUser.phoneNumber,
          });
          if (result.isVerified) {
            setPhoneNumberInContext(parsedUser.phoneNumber);
            setUser(parsedUser);
            await setAsyncStorageValue('user', JSON.stringify(parsedUser));
            router.replace(`/(tabs)/chats`);
          } else {
            router.replace(`/verify/${parsedUser.phoneNumber}`);
          }
          setIsJwtChecked('checked');
        } catch (e) {
          setIsJwtChecked('failed');
        }
      } else {
        setIsJwtChecked('failed');
      }
    })();
  }, [setPhoneNumberInContext, setUser, userVerificationMutate]);

  if (isJwtChecked === 'pending') {
    return (
      <ActivityIndicator
        color={Colors.primary}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Image source={{ uri: logo_image }} style={styles.welcome} />
      <Text style={styles.headline}>Login to Signify Plus</Text>

      <View style={{ width: '100%' }}>
        <PhoneInput
          containerStyle={{
            width: '100%',
            borderWidth: 1,
            borderColor: phoneError ? Colors.red : Colors.gray,
            marginBottom: phoneError ? 5 : 10,
            borderRadius: 10,
            padding: 0,
            height: 50,
          }}
          codeTextStyle={{
            padding: 0,
            margin: 0,
            height: 60,
            lineHeight: 60,
          }}
          countryPickerButtonStyle={{
            padding: 0,
            margin: 0,
          }}
          flagButtonStyle={{
            padding: 0,
            margin: 0,
          }}
          textContainerStyle={{
            borderRadius: 10,
          }}
          textInputStyle={{
            marginTop: 4.5,
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          defaultCode="TR"
          layout="first"
          onChangeFormattedText={handlePhoneNumberChange}
          textInputProps={{
            onBlur: handlePhoneBlur,
          }}
        />
        {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
      </View>

      <View style={{ width: '100%' }}>
        <View
          style={[
            styles.passwordContainer,
            passwordError ? { borderColor: Colors.red } : {},
          ]}
        >
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={handlePasswordChange}
            onBlur={handlePasswordBlur}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              color={Colors.primary}
              size={24}
            />
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
      </View>

      <Link href={'/forgot-password'} replace asChild>
        <TouchableOpacity style={{ width: '100%', alignItems: 'flex-end' }}>
          <Text style={[styles.linkText, { fontSize: 14 }]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </Link>
      {loginError && <Text style={styles.errorText}>{loginError}</Text>}

      <TouchableOpacity
        style={[styles.button, isInvalid && styles.disabledButton]}
        onPress={handleLogin}
        disabled={isInvalid || isPending}
      >
        <Text style={styles.buttonText}>
          {isPending ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <Link href={'/signup'} replace asChild>
        <TouchableOpacity>
          <Text style={styles.linkText}>
            Don&#39;t have an account? Sign Up
          </Text>
        </TouchableOpacity>
      </Link>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  welcome: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    marginBottom: 50,
  },
  headline: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  passwordContainer: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  passwordInput: {
    flex: 1,
  },
  errorText: {
    color: Colors.red || 'red',
    fontSize: 14,
    marginBottom: 10,
    width: '100%',
  },
  button: {
    width: '100%',
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: Colors.gray,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: Colors.primary,
    marginTop: 20,
    fontSize: 16,
  },
});

export default LoginScreen;
