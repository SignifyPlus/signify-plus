import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { useSettingsQuery } from '@/api/settings/settings-query';
import { useUpdateUserMutation } from '@/api/user/update-user-mutation';
import { useAppContext } from '@/context/app-context';
import { EditableField } from '@/components/EditableField';
import { validatePasswordsMatch, validatePasswordStrength } from '@/app/signup';
import { queryClient } from '@/api';
import { SettingsProfilePicture } from '@/components/SettingsProfilePicture';
import { setAsyncStorageValue } from '@/context/async-storage';
import { Ionicons } from '@expo/vector-icons';

const Page = () => {
  const { phoneNumber, user, setUser, reset } = useAppContext();
  const { data: settings, isLoading } = useSettingsQuery({ phoneNumber });
  const { mutate: updateUser } = useUpdateUserMutation();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [editingPassword, setEditingPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation errors
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const handleLogout = () => {
    setAsyncStorageValue('user', '').then(() => {
      reset();
      router.replace('/');
      queryClient.removeQueries();
    });
  };

  // Password field handlers
  const handleNewPasswordChange = (text: string) => {
    setNewPassword(text);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
  };

  // Validation on blur
  const handleNewPasswordBlur = () => {
    const error = validatePasswordStrength(newPassword);
    setPasswordError(error || '');
  };

  const handleConfirmPasswordBlur = () => {
    const error = validatePasswordsMatch(newPassword, confirmPassword);
    setConfirmPasswordError(error || '');
  };

  const resetPasswordFields = () => {
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setConfirmPasswordError('');
    setGeneralError('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setEditingPassword(false);
  };

  const handleChangePassword = () => {
    if (!user) return;

    // Clear previous errors
    setGeneralError('');

    // Validate fields
    const strengthError = validatePasswordStrength(newPassword);
    const matchError = validatePasswordsMatch(newPassword, confirmPassword);

    // Update error states
    setPasswordError(strengthError || '');
    setConfirmPasswordError(matchError || '');

    // If any validation errors, don't proceed
    if (strengthError || matchError) {
      return;
    }

    updateUser(
      {
        phoneNumber: user.phoneNumber,
        password: newPassword,
      },
      {
        onSuccess: () => {
          resetPasswordFields();
          alert('Password changed successfully');
        },
        onError: (error) => {
          setGeneralError('Failed to update password. Please try again.');
          console.error('Password update error:', error);
        },
      }
    );
  };

  if (isLoading || !settings) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.userHeader}>
          <SettingsProfilePicture />
          <View style={styles.userText}>
            <EditableField
              max={30}
              value={user?.name ?? ''}
              onSave={(newName) => {
                if (!user) return;
                setUser({ ...user, name: newName });
                updateUser(
                  {
                    phoneNumber: user.phoneNumber,
                    name: newName,
                  },
                  {
                    onSuccess: (data) => {
                      setUser({ ...user, name: data.name });
                    },
                  }
                );
              }}
              size="large"
              name="name"
            />
            <EditableField
              max={100}
              value={user?.profileStatus ?? ''}
              onSave={(newStatus) => {
                if (!user) return;
                setUser({ ...user, profileStatus: newStatus });
                updateUser(
                  {
                    phoneNumber: user.phoneNumber,
                    profileStatus: newStatus,
                  },
                  {
                    onSuccess: (data) => {
                      setUser({ ...user, profileStatus: data.profileStatus });
                    },
                  }
                );
              }}
              size="small"
              name="status"
            />
          </View>
        </View>

        <Text style={styles.title}>Account Settings</Text>

        <Text style={styles.label}>Phone</Text>
        <Text style={styles.valueText}>{phoneNumber}</Text>

        <Text style={styles.label}>Password</Text>
        {!editingPassword ? (
          <TouchableWithoutFeedback onPress={() => setEditingPassword(true)}>
            <Text style={styles.passwordPlaceholder}>********</Text>
          </TouchableWithoutFeedback>
        ) : (
          <View>
            <View>
              <View
                style={[
                  styles.passwordContainer,
                  passwordError ? styles.inputError : null,
                ]}
              >
                <TextInput
                  placeholder="New Password"
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={handleNewPasswordChange}
                  onBlur={handleNewPasswordBlur}
                  style={styles.passwordInput}
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <Ionicons
                    name={showNewPassword ? 'eye-off' : 'eye'}
                    color={Colors.primary}
                    size={24}
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
            </View>

            <View>
              <View
                style={[
                  styles.passwordContainer,
                  confirmPasswordError ? styles.inputError : null,
                ]}
              >
                <TextInput
                  placeholder="Confirm Password"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={handleConfirmPasswordChange}
                  onBlur={handleConfirmPasswordBlur}
                  style={styles.passwordInput}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    color={Colors.primary}
                    size={24}
                  />
                </TouchableOpacity>
              </View>
              {confirmPasswordError ? (
                <Text style={styles.errorText}>{confirmPasswordError}</Text>
              ) : null}
            </View>

            {generalError ? (
              <Text style={styles.errorText}>{generalError}</Text>
            ) : null}

            <TouchableOpacity
              style={[
                styles.saveButton,
                !newPassword ||
                !confirmPassword ||
                !!passwordError ||
                !!confirmPasswordError
                  ? styles.disabledButton
                  : null,
              ]}
              onPress={handleChangePassword}
              disabled={
                !newPassword ||
                !confirmPassword ||
                !!passwordError ||
                !!confirmPasswordError
              }
            >
              <Text style={styles.saveButtonText}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={resetPasswordFields}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 40 }} />
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutAction}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  userText: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    marginTop: 32,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#111',
    fontWeight: '500',
    marginBottom: 8,
  },
  valueText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  passwordPlaceholder: {
    fontSize: 16,
    color: '#666',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 6,
    height: 48,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#d32f2f',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelText: {
    color: '#d32f2f',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  logoutAction: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d32f2f',
    textAlign: 'left',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 13,
    marginBottom: 8,
  },
});

export default Page;
