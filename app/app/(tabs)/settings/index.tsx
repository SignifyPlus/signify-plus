import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { UserSettings, useSettingsQuery } from '@/api/settings/settings-query';
import { useUpdateSettingsMutation } from '@/api/settings/update-settings-mutation';
import { useAppContext } from '@/context/app-context';
import { Ionicons } from '@expo/vector-icons';

const Page = () => {
  const context = useAppContext();
  const phoneNumber = context.phoneNumber!;
  const { data: settings, isLoading } = useSettingsQuery({ phoneNumber });
  const { mutate } = useUpdateSettingsMutation();

  const updateSetting = <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => {
    if (!settings) return;
    mutate({
      ...settings,
      [key]: value,
      phoneNumber,
    });
  };

  const handleLogout = async () => {
    router.replace('/');
  };

  if (isLoading || !settings) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.userHeader}>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person-outline" />
        </View>
        <View style={styles.userText}>
          <Text style={styles.userName}>{settings.userId?.name ?? 'User'}</Text>
          <Text style={styles.userStatus}>Available</Text>
        </View>
      </View>

      <Text style={styles.title}>Accessibility Settings</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Enable Notifications</Text>
        <Switch
          value={settings.notificationEnabled}
          onValueChange={(value) => updateSetting('notificationEnabled', value)}
          trackColor={{ false: '#ccc', true: Colors.primary }}
          thumbColor={Platform.OS === 'android' ? '#fff' : undefined}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Auto Download</Text>
        <Switch
          value={settings.autoDownload}
          onValueChange={(value) => updateSetting('autoDownload', value)}
          trackColor={{ false: '#ccc', true: Colors.primary }}
          thumbColor={Platform.OS === 'android' ? '#fff' : undefined}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.textWrapper}>
          <Text style={styles.label}>ASL Translation Language</Text>
          <Text style={styles.subLabel}>
            Used for visual translation support
          </Text>
        </View>
        <View style={styles.dropdownWrapper}>
          <Picker
            selectedValue={settings.aslTranslationLanguage}
            onValueChange={(value) =>
              updateSetting('aslTranslationLanguage', value)
            }
            style={styles.picker}
          >
            <Picker.Item label="🇬🇧 English" value={0} />
            <Picker.Item label="🇹🇷 Turkish" value={1} />
          </Picker>
        </View>
      </View>

      <View style={{ height: 40 }} />
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.logoutAction}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 60,
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
    flexDirection: 'column',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  userStatus: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    marginTop: 32,
    marginBottom: 12,
  },
  row: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#111',
    fontWeight: '500',
  },
  subLabel: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  textWrapper: {
    flex: 1,
    paddingRight: 8,
  },
  dropdownWrapper: {
    width: 140,
  },
  picker: {
    height: 44,
    width: '100%',
    color: '#111',
  },
  logoutAction: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d32f2f',
    textAlign: 'left',
  },
});

export default Page;
