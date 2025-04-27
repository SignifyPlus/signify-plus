import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
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
import { Ionicons } from '@expo/vector-icons';
import { EditableField } from '@/components/EditableField';
import { validatePasswordsMatch, validatePasswordStrength } from '@/app/signup';
import { queryClient } from '@/api';

const Page = () => {
  const { phoneNumber, user, setUser } = useAppContext();
  const { data: settings, isLoading } = useSettingsQuery({ phoneNumber });
  // const { mutate: updateSettings } = useUpdateSettingsMutation();
  const { mutate: updateUser } = useUpdateUserMutation();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [editingPassword, setEditingPassword] = useState(false);
  const [error, setError] = useState('');

  // const updateSetting = <K extends keyof UserSettings>(
  //   key: K,
  //   value: UserSettings[K]
  // ) => {
  //   if (!settings) return;
  //   updateSettings({
  //     ...settings,
  //     [key]: value,
  //     phoneNumber: phoneNumber!,
  //   });
  // };

  const handleLogout = () => {
    router.replace('/');
    queryClient.removeQueries();
  };

  const handleChangePassword = () => {
    if (!user) return;

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

    updateUser({
      phoneNumber: user.phoneNumber,
      password: newPassword,
    });
    setNewPassword('');
    setConfirmPassword('');
    setEditingPassword(false);
    setError('');
    alert('Password changed successfully');
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
          {user?.profilePicture ? (
            <Image
              source={{ uri: user.profilePicture }}
              style={styles.avatarPlaceholder}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person-outline" size={28} color="#555" />
            </View>
          )}
          <View style={styles.userText}>
            <EditableField
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

        {/*<Text style={styles.title}>Accessibility Settings</Text>*/}

        {/*<View style={styles.row}>*/}
        {/*  <Text style={styles.label}>Enable Notifications</Text>*/}
        {/*  <Switch*/}
        {/*    value={settings.notificationEnabled}*/}
        {/*    onValueChange={(value) =>*/}
        {/*      updateSetting('notificationEnabled', value)*/}
        {/*    }*/}
        {/*    trackColor={{ false: '#ccc', true: Colors.primary }}*/}
        {/*    thumbColor={Platform.OS === 'android' ? '#fff' : undefined}*/}
        {/*  />*/}
        {/*</View>*/}

        {/*<View style={styles.row}>*/}
        {/*  <Text style={styles.label}>Auto Download</Text>*/}
        {/*  <Switch*/}
        {/*    value={settings.autoDownload}*/}
        {/*    onValueChange={(value) => updateSetting('autoDownload', value)}*/}
        {/*    trackColor={{ false: '#ccc', true: Colors.primary }}*/}
        {/*    thumbColor={Platform.OS === 'android' ? '#fff' : undefined}*/}
        {/*  />*/}
        {/*</View>*/}

        {/*<View style={styles.row}>*/}
        {/*  <View style={styles.textWrapper}>*/}
        {/*    <Text style={styles.label}>ASL Translation Language</Text>*/}
        {/*    <Text style={styles.subLabel}>*/}
        {/*      Used for visual translation support*/}
        {/*    </Text>*/}
        {/*  </View>*/}
        {/*  <View style={styles.dropdownWrapper}>*/}
        {/*    <Picker*/}
        {/*      selectedValue={settings.aslTranslationLanguage}*/}
        {/*      onValueChange={(value) =>*/}
        {/*        updateSetting('aslTranslationLanguage', value)*/}
        {/*      }*/}
        {/*      style={styles.picker}*/}
        {/*    >*/}
        {/*      <Picker.Item label="🇬🇧 English" value={0} />*/}
        {/*      <Picker.Item label="🇹🇷 Turkish" value={1} />*/}
        {/*    </Picker>*/}
        {/*  </View>*/}
        {/*</View>*/}

        <Text style={styles.title}>Account Settings</Text>

        <Text style={styles.label}>Phone</Text>
        <Text
          style={{
            fontSize: 16,
            color: '#666',
            // paddingVertical: 8,
            // borderBottomWidth: 1,
            borderColor: '#ccc',
            marginBottom: 20,
          }}
        >
          {phoneNumber}
        </Text>

        <Text style={styles.label}>Password</Text>
        {!editingPassword ? (
          <TouchableWithoutFeedback onPress={() => setEditingPassword(true)}>
            <Text
              style={{
                fontSize: 16,
                color: '#666',
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderColor: '#ccc',
              }}
            >
              ********
            </Text>
          </TouchableWithoutFeedback>
        ) : (
          <View>
            <TextInput
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              style={styles.input}
            />
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleChangePassword}
            >
              <Text style={styles.saveButtonText}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditingPassword(false)}>
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
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ddd',
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
  // row: {
  //   paddingVertical: 16,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  // },
  label: {
    fontSize: 16,
    color: '#111',
    fontWeight: '500',
    marginBottom: 8,
  },
  // subLabel: {
  //   fontSize: 13,
  //   color: '#888',
  //   marginTop: 4,
  // },
  // textWrapper: {
  //   flex: 1,
  //   paddingRight: 8,
  // },
  // dropdownWrapper: {
  //   width: 140,
  // },
  // picker: {
  //   height: 44,
  //   width: '100%',
  //   color: '#111',
  // },
  passwordField: {
    fontSize: 16,
    color: '#666',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
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
    textAlign: 'center',
  },
});

export default Page;
