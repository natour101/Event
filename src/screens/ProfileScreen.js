import React, { useMemo } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function ProfileScreen() {
  const { t, isRTL } = useLanguage();
  const { theme, mode, toggleMode } = useTheme();
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);

  return (
    <View style={styles.container}>
      <ScreenHeader title={t('profile.title')} />
      <View style={styles.card}>
        <Text style={styles.name}>{t('profile.name')}</Text>
        <Text style={styles.subtitle}>{t('profile.role')}</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>{t('profile.themeToggle')}</Text>
          <Switch
            value={mode === 'softDark'}
            onValueChange={toggleMode}
            trackColor={{ true: theme.accent, false: theme.border }}
            thumbColor={theme.text}
          />
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme, isRTL) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 20,
      gap: 16,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 18,
      padding: 16,
      alignItems: 'center',
      gap: 10,
    },
    name: {
      color: theme.text,
      fontSize: 18,
      fontWeight: '700',
    },
    subtitle: {
      color: theme.muted,
      fontSize: 13,
    },
    row: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    label: {
      color: theme.text,
      fontSize: 14,
      fontWeight: '600',
    },
  });
