import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAsyncStorageValue = async (key: string) => {
  return await AsyncStorage.getItem(key);
};

export const setAsyncStorageValue = async (key: string, value: string) => {
  return await AsyncStorage.setItem(key, value);
};
