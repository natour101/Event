import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { api } from './api';

export const registerDeviceToken = async token => {
  const fcmToken = await messaging().getToken();
  if (!fcmToken || !token) return;
  api.setToken(token);
  await api.post('/device/token', {
      token: fcmToken,
      platform: Platform.OS,
  });
};

export const setupNotifications = async () => {
  await messaging().requestPermission();
  messaging().onMessage(async message => {
    // handle foreground messages if needed
    console.log('FCM foreground', message);
  });
};
