import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Colors from '@/constants/Colors';
import { Link, useRouter } from 'expo-router';
import welcomeImage from '@/assets/images/logo.jpeg';
import { useCreateUserMutation } from '@/api/user/create-user-mutation';
import { useAppContext } from '@/context/app-context';
import { sanitizePhoneNumber } from '@/constants/utils';
import { Ionicons } from '@expo/vector-icons';
import PhoneInput from 'react-native-phone-number-input';

const welcome_image = Image.resolveAssetSource(welcomeImage).uri;

const SignupScreen = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [touchedFields, setTouchedFields] = useState({
    phone: false,
    password: false,
    repeatPassword: false,
  });

  const { setPhoneNumber: setPhoneNumberInContext, setUser } = useAppContext();
  const router = useRouter();
  const { mutate: createUser, isPending } = useCreateUserMutation();

  const validatePhoneNumber = (number: string) => {
    const phoneRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    return phoneRegex.test(number)
      ? ''
      : 'Invalid phone number. Use format +491234567890';
  };

  const handleSignup = () => {
    const phoneErr = validatePhoneNumber(phoneNumber);
    const strengthErr = validatePasswordStrength(password);
    const matchErr = validatePasswordsMatch(password, repeatPassword);

    setPhoneError(phoneErr);
    setPasswordError(strengthErr || matchErr);

    if (!phoneErr && !strengthErr && !matchErr) {
      const sanitizedPhoneNumber = sanitizePhoneNumber(phoneNumber);
      createUser(
        { name, phoneNumber: sanitizedPhoneNumber, password },
        {
          onSuccess: (data) => {
            setUser(data[0]!);
            setPhoneNumberInContext(sanitizedPhoneNumber);
            setName('');
            setPhoneNumber('');
            setPassword('');
            setRepeatPassword('');
            router.replace(`/verify/${sanitizedPhoneNumber}`);
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
    !validatePhoneNumber(phoneNumber) &&
    !validatePasswordStrength(password) &&
    !validatePasswordsMatch(password, repeatPassword);

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
        textInputProps={{
          onBlur: () => {
            setTouchedFields((prev) => ({ ...prev, phone: true }));
          },
        }}
      />
      {touchedFields.phone && phoneError ? (
        <Text style={styles.errorText}>{phoneError}</Text>
      ) : null}

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          onBlur={() => {
            setTouchedFields((prev) => ({ ...prev, password: true }));
            const err =
              validatePasswordStrength(password) ||
              validatePasswordsMatch(password, repeatPassword);
            setPasswordError(err);
          }}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            color={Colors.primary}
            size={24}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Repeat Password"
          secureTextEntry={!showRepeatPassword}
          value={repeatPassword}
          onChangeText={setRepeatPassword}
          onBlur={() => {
            setTouchedFields((prev) => ({ ...prev, repeatPassword: true }));
            const err =
              validatePasswordStrength(password) ||
              validatePasswordsMatch(password, repeatPassword);
            setPasswordError(err);
          }}
        />
        <TouchableOpacity
          onPress={() => setShowRepeatPassword(!showRepeatPassword)}
        >
          <Ionicons
            name={showRepeatPassword ? 'eye-off' : 'eye'}
            color={Colors.primary}
            size={24}
          />
        </TouchableOpacity>
      </View>

      {(touchedFields.password || touchedFields.repeatPassword) &&
      passwordError ? (
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

      <Link href={'/'} replace asChild>
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

export const validatePasswordsMatch = (pwd: string, repeatPwd: string) => {
  return pwd !== repeatPwd ? 'Passwords do not match' : '';
};

export const validatePasswordStrength = (pwd: string) => {
  const lengthRequirement = /.{8,}/;
  const lowercaseRequirement = /[a-z]/;
  const uppercaseRequirement = /[A-Z]/;
  const digitRequirement = /\d/;
  const specialCharRequirement = /[!@#$%^&*(),.?":{}|<>]/;

  return !(
    lengthRequirement.test(pwd) &&
    lowercaseRequirement.test(pwd) &&
    uppercaseRequirement.test(pwd) &&
    digitRequirement.test(pwd) &&
    specialCharRequirement.test(pwd)
  )
    ? 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
    : '';
};

export default SignupScreen;
