import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAsyncStorageValue = async (key: string) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    // read error
    console.error('Error reading value from AsyncStorage:', e);
    return null;
  }
};

export const setAsyncStorageValue = async (key: string, value: string) => {
  try {
    return await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error('Error saving value to AsyncStorage:', e);
    // save error
    return null;
  }
};
