import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAsyncStorageValue = async (key: string) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    // read error
    return null;
  }
};

export const setAsyncStorageValue = async (key: string, value: string) => {
  try {
    return await AsyncStorage.setItem(key, value);
  } catch (e) {
    // save error
    return null;
  }
};
