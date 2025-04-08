import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Colors from '@/constants/Colors';
import { Link, router } from 'expo-router';
import logoImage from '@/assets/images/logo.jpeg';
import { useLoginUserMutation } from '@/api/user/login-user-mutation';
import { useAppContext } from '@/context/app-context';

const logo_image = Image.resolveAssetSource(logoImage).uri;

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [loginError, setLoginError] = useState('');

  const { mutate, isPending } = useLoginUserMutation();

  const { setPhoneNumber: setPhoneNumberInContext } = useAppContext();

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

    setLoginError('');
    mutate(
      { phoneNumber, password },
      {
        onSuccess: () => {
          setPhoneNumberInContext(phoneNumber);
          router.replace('/chats');
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

      <TextInput
        style={styles.input}
        placeholder="Phone Number (e.g., +491234567890)"
        keyboardType="phone-pad"
        value={phoneNumber}
        onFocus={() => setPhoneError('')}
        onBlur={() => validatePhoneNumber(phoneNumber)}
        onChangeText={setPhoneNumber}
      />
      {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

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
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
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
