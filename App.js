import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { setupNotifications } from './src/services/notifications';

export default function App() {
  useEffect(() => {
    setupNotifications();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <NotificationProvider>
            <AuthProvider>
              <StatusBar barStyle="light-content" />
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
            </AuthProvider>
          </NotificationProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
