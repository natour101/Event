import React, { useMemo } from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import Icon from '../components/Icon';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function WelcomeScreen({ navigation }) {
  const { t, toggleLanguage, isRTL, language } = useLanguage();
  const { theme, mode } = useTheme();

  const styles = useMemo(() => createStyles(theme, isRTL, mode), [theme, isRTL, mode]);

  return (
    <ImageBackground
      source={require('../assets/images/logo.png')}
      style={styles.background}
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.centerContent}>
            <View style={styles.card}>
              <View style={styles.logo}>
                <Image
                  source={require('../assets/images/image.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                {t('welcome.title')}
              </Text>

              <Text style={styles.subtitle} numberOfLines={3} ellipsizeMode="tail">
                {t('welcome.subtitle')}
              </Text>
            </View>
          </View>

          <View style={styles.actionsCard}>
            <PrimaryButton
              label={t('common.register')}
              onPress={() => navigation.navigate('Auth', { mode: 'register' })}
            />

            <PrimaryButton
              label={t('common.login')}
              variant="secondary"
              onPress={() => navigation.navigate('Auth', { mode: 'login' })}
            />

            <View style={styles.languageRow}>
              <Icon name="earth" size={16} color={theme.muted} />
              <Text style={styles.languageText} onPress={toggleLanguage}>
                {t('welcome.changeLanguage')}{' '}
                {language === 'ar' ? t('common.english') : t('common.arabic')}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const createStyles = (theme, isRTL, mode) =>
  StyleSheet.create({
    background: {
      flex: 1,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor:
        mode === 'softDark'
          ? 'rgb(255, 255, 255)'
          : 'rgb(20, 12, 8)',
    },
    container: {
      flex: 1,
      justifyContent: 'space-between',
      padding: 24,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'space-between',
      gap: 20,
      paddingBottom: 20,
    },
    centerContent: {
      marginTop: 90,
      alignItems: 'center',
    },
    card: {
      width: '100%',
      backgroundColor: theme.surface,
      borderRadius: 22,
      paddingVertical: 28,
      paddingHorizontal: 20,
      alignItems: 'center',
      gap: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    logo: {
      width: 0,
      height: 0,
      borderRadius: 24,
      backgroundColor: theme.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
      shadowColor: '#000',
      shadowOpacity: 0.35,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 12,
    },
    logoImage: {
      width: 0,
      height: 0,
    },
    title: {
      color: theme.text,
      fontSize: 28,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 12,
    },
    subtitle: {
      color: theme.textDark,
      textAlign: 'center',
      fontSize: 15,
      lineHeight: 22,
      flexShrink: 1,
    },
    actionsCard: {
      gap: 14,
      backgroundColor: theme.surface,
      borderRadius: 22,
      padding: 18,
      borderWidth: 1,
      borderColor: theme.border,
    },
    languageRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 6,
      gap: 8,
    },
    languageText: {
      color: theme.muted,
      fontSize: 14,
      textAlign: isRTL ? 'right' : 'left',
    },
  });
