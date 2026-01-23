import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import Icon from '../components/Icon';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import ScreenHeader from '../components/ScreenHeader';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function ProfileScreen() {
  const { t, isRTL } = useLanguage();
  const { theme, mode, toggleMode } = useTheme();
  const { user, logout } = useAuth();
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);

  const userName = user?.username || t('profile.name');
  const userEmail = user?.email || 'user@email.com';
  const userPhone = user?.phone || '+966 5x xxx xxxx';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader title={t('profile.title')} />
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Icon name="account" size={36} color={theme.text} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {userName}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
            {userEmail}
          </Text>
          <Text style={styles.meta} numberOfLines={1} ellipsizeMode="tail">
            {userPhone}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('profile.accountSettings')}</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{t('profile.username')}</Text>
            <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
              {userName}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>{t('profile.email')}</Text>
            <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
              {userEmail}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>{t('profile.phone')}</Text>
            <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
              {userPhone}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('profile.theme')}</Text>
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('profile.language')}</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>{t('common.language')}</Text>
            <Text style={styles.value}>{t('common.arabic')} / {t('common.english')}</Text>
          </View>
        </View>
      </View>

      <PrimaryButton label={t('profile.logout')} variant="secondary" onPress={logout} />
    </ScrollView>
  );
}

const createStyles = (theme, isRTL) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      padding: 20,
      gap: 16,
      paddingBottom: 32,
    },
    profileHeader: {
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: 16,
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 16,
    },
    avatar: {
      width: 70,
      height: 70,
      borderRadius: 24,
      backgroundColor: theme.surfaceLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    profileInfo: {
      flex: 1,
      alignItems: isRTL ? 'flex-end' : 'flex-start',
    },
    name: {
      color: theme.text,
      fontSize: 20,
      fontWeight: '700',
    },
    subtitle: {
      color: theme.muted,
      fontSize: 13,
      marginTop: 4,
      flexShrink: 1,
    },
    meta: {
      color: theme.textDark,
      fontSize: 12,
      marginTop: 4,
      flexShrink: 1,
    },
    section: {
      gap: 12,
    },
    sectionTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '700',
      textAlign: isRTL ? 'right' : 'left',
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 18,
      padding: 16,
      gap: 12,
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
      flexShrink: 1,
    },
    value: {
      color: theme.textDark,
      fontSize: 13,
      flexShrink: 1,
    },
    divider: {
      height: 1,
      backgroundColor: theme.border,
    },
    infoRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
    },
  });
