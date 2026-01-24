import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenHeader from '../components/ScreenHeader';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';

export default function NotificationsScreen() {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const { notifications, markAllRead } = useNotifications();
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);

  useFocusEffect(
    React.useCallback(() => {
      markAllRead();
    }, [markAllRead])
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader title={t('notifications.title')} />
      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>{t('notifications.empty')}</Text>
        </View>
      ) : (
        notifications.map(item => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardMessage}>{item.message}</Text>
            <Text style={styles.cardMeta}>{item.createdAt}</Text>
          </View>
        ))
      )}
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
    emptyState: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
    },
    emptyText: {
      color: theme.muted,
      fontSize: 14,
      textAlign: isRTL ? 'right' : 'left',
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 18,
      padding: 16,
      gap: 6,
      borderWidth: 1,
      borderColor: theme.border,
    },
    cardTitle: {
      color: theme.text,
      fontSize: 15,
      fontWeight: '700',
      textAlign: isRTL ? 'right' : 'left',
    },
    cardMessage: {
      color: theme.textDark,
      fontSize: 13,
      lineHeight: 20,
      textAlign: isRTL ? 'right' : 'left',
    },
    cardMeta: {
      color: theme.muted,
      fontSize: 11,
      textAlign: isRTL ? 'right' : 'left',
    },
  });
