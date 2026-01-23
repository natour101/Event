import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { request } from './api';

export const registerDeviceToken = async token => {
  const fcmToken = await messaging().getToken();
  if (!fcmToken || !token) return;
  await request('/device/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      token: fcmToken,
      platform: Platform.OS,
    }),
  });
};

export const setupNotifications = async () => {
  await messaging().requestPermission();
  messaging().onMessage(async message => {
    // handle foreground messages if needed
    console.log('FCM foreground', message);
  });
};
