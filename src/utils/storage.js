import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  user: 'event-user',
  token: 'event-token',
};

export const saveJson = async (key, value) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const getJson = async key => {
  const raw = await AsyncStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
};

export const removeItem = async key => {
  await AsyncStorage.removeItem(key);
};
