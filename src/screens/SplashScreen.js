import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const LOGO_URL =
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=300&q=80';

export default function SplashScreen() {
  const navigation = useNavigation();
  const { loading } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    if (loading) return;
    const timeout = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    }, 2000);
    return () => clearTimeout(timeout);
  }, [loading, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoWrap}>
        <Image source={{ uri: LOGO_URL }} style={styles.logo} resizeMode="cover" />
      </View>
      <Text style={styles.title}>{t('splash.title')}</Text>
      <Text style={styles.subtitle}>{t('splash.subtitle')}</Text>
      <ActivityIndicator size="large" color={theme.accent} style={styles.loader} />
    </View>
  );
}

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      gap: 12,
    },
    logoWrap: {
      width: 120,
      height: 120,
      borderRadius: 36,
      overflow: 'hidden',
      marginBottom: 8,
      borderWidth: 2,
      borderColor: theme.accent,
    },
    logo: {
      width: '100%',
      height: '100%',
    },
    title: {
      color: theme.text,
      fontSize: 22,
      fontWeight: '700',
      textAlign: 'center',
    },
    subtitle: {
      color: theme.textDark,
      fontSize: 14,
      textAlign: 'center',
    },
    loader: {
      marginTop: 12,
    },
  });
