import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Colors from '@/constants/Colors';
import { Link, useRouter } from 'expo-router';
import welcomeImage from '@/assets/images/logo.jpeg';
import { useCreateUserMutation } from '@/api/user/create-user-mutation';
import { sanitizePhoneNumber, useAppContext } from '@/context/app-context';

const welcome_image = Image.resolveAssetSource(welcomeImage).uri;

const SignupScreen = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { setPhoneNumber: setPhoneNumberInContext } = useAppContext();
  const router = useRouter();
  const { mutate: createUser, isPending } = useCreateUserMutation();

  const validatePhoneNumber = (number: string) => {
    const phoneRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    if (!phoneRegex.test(number)) {
      setPhoneError('Invalid phone number. Use format +491234567890');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const validatePasswordsMatch = (pwd: string, repeatPwd: string) => {
    if (pwd !== repeatPwd) {
      setPasswordError('Passwords do not match');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSignup = () => {
    const isPhoneValid = validatePhoneNumber(phoneNumber);
    const isPasswordMatch = validatePasswordsMatch(password, repeatPassword);
    const sanitizedPhoneNumber = sanitizePhoneNumber(phoneNumber);
    if (isPhoneValid && isPasswordMatch) {
      createUser(
        { name, phoneNumber: sanitizedPhoneNumber, password },
        {
          onSuccess: () => {
            setPhoneNumberInContext(sanitizedPhoneNumber);
            setName('');
            setPhoneNumber('');
            setPassword('');
            setRepeatPassword('');
            router.replace('/chats');
          },
          onError: (err) => {
            Alert.alert('Signup Failed', (err as Error).message);
          },
        }
      );
    }
  };

  const isFormValid =
    name &&
    phoneNumber &&
    password &&
    repeatPassword &&
    !phoneError &&
    !passwordError;

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Image source={{ uri: welcome_image }} style={styles.welcome} />
      <Text style={styles.headline}>Sign Up for Signify Plus</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number (e.g., +491234567890)"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={(text) => {
          setPhoneNumber(text);
          validatePhoneNumber(text);
        }}
      />
      {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          validatePasswordsMatch(text, repeatPassword);
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="Repeat Password"
        secureTextEntry
        value={repeatPassword}
        onChangeText={(text) => {
          setRepeatPassword(text);
          validatePasswordsMatch(password, text);
        }}
      />
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}

      <TouchableOpacity
        style={[styles.button, !isFormValid && styles.disabledButton]}
        onPress={handleSignup}
        disabled={!isFormValid || isPending}
      >
        {isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <Link href={'/login'} replace asChild>
        <TouchableOpacity>
          <Text style={styles.linkText}>Already have an account? Log In</Text>
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

export default SignupScreen;
