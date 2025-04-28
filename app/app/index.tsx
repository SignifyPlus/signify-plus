import React, { useState } from 'react';
import {
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
import { useLoginUserMutation } from '@/api/user/login-user-mutation';
import { useAppContext } from '@/context/app-context';
import { setAsyncStorageValue } from '@/context/async-storage';
import { sanitizePhoneNumber } from '@/constants/utils';
import { Ionicons } from '@expo/vector-icons';
import PhoneInput from 'react-native-phone-number-input';

const logo_image = Image.resolveAssetSource(logoImage).uri;

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [phoneError, setPhoneError] = useState('');
  const [loginError, setLoginError] = useState('');

  const { mutate, isPending } = useLoginUserMutation();
  const { setPhoneNumber: setPhoneNumberInContext, setUser } = useAppContext();

  const validatePhoneNumber = (number: string) => {
    const phoneRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    if (!phoneRegex.test(number)) {
      setPhoneError('Invalid phone number. Use format +491234567890');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleLogin = () => {
    if (!validatePhoneNumber(phoneNumber)) return;
    const santizedPhoneNumber = sanitizePhoneNumber(phoneNumber);
    setLoginError('');
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

  const isInvalid = !(phoneNumber && password && !phoneError);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Image source={{ uri: logo_image }} style={styles.welcome} />
      <Text style={styles.headline}>Login to Signify Plus</Text>

      <PhoneInput
        containerStyle={{
          width: '100%',
          borderWidth: 1,
          borderColor: Colors.gray,
          marginBottom: 10,
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
          height: 60,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        defaultCode="TR"
        layout="first"
        onChangeFormattedText={setPhoneNumber}
      />
      {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            color={Colors.primary}
            size={24}
          />
        </TouchableOpacity>
      </View>

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
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  passwordInput: {
    flex: 1,
  },
  errorText: {
    color: 'red',
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
