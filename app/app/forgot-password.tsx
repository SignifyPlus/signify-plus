import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { useGetOtpMutation } from '@/api/user/get-otp-mutation';
import { useVerifyOtpMutation } from '@/api/user/verify-otp-mutation';
import { useUpdateUserMutation } from '@/api/user/update-user-mutation';
import { validatePasswordsMatch, validatePasswordStrength } from '@/app/signup';
import { sanitizePhoneNumber } from '@/constants/utils';

const RESEND_DELAY = 60;

const ForgotPasswordPage = () => {
  const phoneInputRef = useRef<PhoneInput>(null);
  const [, setPhoneNumber] = useState('');
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const { mutate: sendOtp, isPending: sendingOtp } = useGetOtpMutation();
  const { mutateAsync: verifyOtp, isPending: verifyingOtp } =
    useVerifyOtpMutation();
  const { mutate: updatePassword, isPending: isResetting } =
    useUpdateUserMutation();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((t) => t - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const handleSendOtp = () => {
    const isValid = phoneInputRef.current?.isValidNumber(formattedPhoneNumber);
    if (!isValid) {
      setError('Invalid phone number. Use format +491234567890');
      return;
    }

    const sanitized = sanitizePhoneNumber(formattedPhoneNumber);
    sendOtp(sanitized, {
      onSuccess: () => {
        setOtpSent(true);
        setResendTimer(RESEND_DELAY);
        setError('');
      },
      onError: () => {
        setError('Failed to send OTP. Please check your phone number.');
      },
    });
  };

  const handleVerifyOtp = async () => {
    const sanitized = sanitizePhoneNumber(formattedPhoneNumber);
    try {
      const result = await verifyOtp({ phoneNumber: sanitized, otpCode });
      if (result.valid) {
        setIsOtpVerified(true);
        setError('');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch {
      setError('OTP verification failed. Try again.');
    }
  };

  const handleResetPassword = () => {
    const strengthError = validatePasswordStrength(newPassword);
    const matchError = validatePasswordsMatch(newPassword, confirmPassword);

    if (strengthError) {
      setError(strengthError);
      return;
    }

    if (matchError) {
      setError(matchError);
      return;
    }

    const sanitized = sanitizePhoneNumber(formattedPhoneNumber);
    console.log({ phoneNumber: sanitized, password: newPassword });
    updatePassword(
      { phoneNumber: sanitized, password: newPassword },
      {
        onSuccess: () => {
          setPhoneNumber('');
          setOtpCode('');
          setNewPassword('');
          setConfirmPassword('');
          setOtpSent(false);
          setIsOtpVerified(false);
          setError('');
          setSuccessMessage('Password reset successfully. You can now log in.');
        },
        onError: (data) => {
          setError(`Failed to reset password. Try again. ${data.message}`);
        },
      }
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>Reset Your Password</Text>
        {!successMessage && (
          <Text style={styles.subtitle}>
            Enter your phone number to receive an OTP and reset your password.
          </Text>
        )}

        {!successMessage && (
          <PhoneInput
            ref={phoneInputRef}
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
              marginTop: 4.5,
              height: 60,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            defaultCode="TR"
            layout="first"
            onChangeText={setPhoneNumber}
            onChangeFormattedText={setFormattedPhoneNumber}
            disabled={otpSent}
          />
        )}
        {otpSent && !isOtpVerified && (
          <>
            <TextInput
              placeholder="Enter OTP"
              value={otpCode}
              onChangeText={setOtpCode}
              style={styles.input}
              keyboardType="number-pad"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleVerifyOtp}
              disabled={verifyingOtp}
            >
              <Text style={styles.buttonText}>
                {verifyingOtp ? 'Verifying...' : 'Verify OTP'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSendOtp}
              disabled={resendTimer > 0}
              style={[
                styles.resendButton,
                resendTimer > 0 && styles.disabledButton,
              ]}
            >
              <Text style={styles.resendText}>
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {!otpSent && !successMessage && (
          <TouchableOpacity
            style={styles.button}
            onPress={handleSendOtp}
            disabled={sendingOtp}
          >
            <Text style={styles.buttonText}>
              {sendingOtp ? 'Sending OTP...' : 'Get OTP'}
            </Text>
          </TouchableOpacity>
        )}

        {isOtpVerified && (
          <>
            <View style={styles.passwordField}>
              <TextInput
                placeholder="New Password"
                secureTextEntry={!showPassword}
                value={newPassword}
                onChangeText={setNewPassword}
                style={styles.passwordInput}
              />
              <TouchableOpacity onPress={() => setShowPassword((s) => !s)}>
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordField}>
              <TextInput
                placeholder="Confirm Password"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.passwordInput}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword((s) => !s)}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleResetPassword}
              disabled={isResetting}
            >
              <Text style={styles.buttonText}>
                {isResetting ? 'Resetting...' : 'Reset Password'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {successMessage ? (
          <Text style={styles.successText}>{successMessage}</Text>
        ) : null}

        <TouchableOpacity onPress={() => router.replace('/')}>
          <Text style={styles.backToLogin}>← Back to Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordPage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  phoneInputContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 10,
    marginBottom: 12,
    height: 50,
    padding: 0,
  },
  phoneTextContainer: {
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  input: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  passwordField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingRight: 8,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendButton: {
    alignSelf: 'center',
    marginTop: -4,
  },
  resendText: {
    color: Colors.primary,
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.4,
  },
  backToLogin: {
    color: Colors.primary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 13,
    marginBottom: 8,
    textAlign: 'center',
  },
  successText: {
    color: '#388e3c',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
});
