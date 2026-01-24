import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from '../components/Icon';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { adminApi } from '../services/api';

export default function AdminDashboardScreen() {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);
  const [events, setEvents] = useState([]);
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminApi.eventsSummary();
      setEvents(response.data?.items || []);
    } catch (fetchError) {
      setError(fetchError?.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const fetchEventRegistrations = useCallback(
    async eventId => {
      setError('');
      try {
        const response = await adminApi.eventRegistrations(eventId);
        const registrations = response.data?.registrations || [];
        setEvents(prev =>
          prev.map(item =>
            item.id === eventId ? { ...item, registrations } : item
          )
        );
      } catch (fetchError) {
        setError(fetchError?.message || t('common.error'));
      }
    },
    [t]
  );

  const onToggleEvent = eventId => {
    const shouldExpand = expandedEventId !== eventId;
    setExpandedEventId(shouldExpand ? eventId : null);
    if (shouldExpand) {
      const event = events.find(item => item.id === eventId);
      if (!event?.registrations) {
        fetchEventRegistrations(eventId);
      }
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader title={t('admin.title')} subtitle={t('admin.subtitle')} />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {loading ? (
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      ) : null}
      {events.map(event => {
        const attendeeCount =
          event.registrations_count ??
          event.bookings_count ??
          event.attendees ??
          0;
        const registrationsLabel = t('admin.registrationsCount').replace(
          '{{count}}',
          String(attendeeCount)
        );
        const isExpanded = expandedEventId === event.id;
        return (
          <View key={event.id} style={styles.card}>
            <View style={styles.eventRow}>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle} numberOfLines={2}>
                  {event.title}
                </Text>
                <Text style={styles.eventMeta}>{registrationsLabel}</Text>
              </View>
              <PrimaryButton
                label={isExpanded ? t('admin.hideDetails') : t('admin.viewDetails')}
                variant="secondary"
                onPress={() => onToggleEvent(event.id)}
              />
            </View>
            {isExpanded ? (
              <View style={styles.registrationList}>
                {event.registrations?.length ? (
                  event.registrations.map((registration, index) => (
                    <View key={`${registration.id || index}`} style={styles.registrationRow}>
                      <View style={styles.registrationIcon}>
                        <Icon name="account" size={16} color={theme.text} />
                      </View>
                      <View style={styles.registrationInfo}>
                        <Text style={styles.registrationName}>
                          {registration.name || t('profile.noData')}
                        </Text>
                        <Text style={styles.registrationPhone}>
                          {registration.phone_number || t('profile.noData')}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyText}>{t('common.empty')}</Text>
                )}
              </View>
            ) : null}
          </View>
        );
      })}
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
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.border,
      gap: 12,
    },
    eventRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
    },
    eventInfo: {
      flex: 1,
      alignItems: isRTL ? 'flex-end' : 'flex-start',
    },
    eventTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '700',
      textAlign: isRTL ? 'right' : 'left',
    },
    eventMeta: {
      color: theme.muted,
      fontSize: 12,
      marginTop: 6,
    },
    registrationList: {
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: 12,
      gap: 10,
    },
    registrationRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 12,
      padding: 10,
      borderRadius: 14,
      backgroundColor: theme.surfaceLight,
    },
    registrationIcon: {
      width: 32,
      height: 32,
      borderRadius: 12,
      backgroundColor: theme.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    registrationInfo: {
      flex: 1,
      alignItems: isRTL ? 'flex-end' : 'flex-start',
    },
    registrationName: {
      color: theme.text,
      fontSize: 13,
      fontWeight: '600',
      textAlign: isRTL ? 'right' : 'left',
    },
    registrationPhone: {
      color: theme.textDark,
      fontSize: 12,
      marginTop: 4,
      textAlign: isRTL ? 'right' : 'left',
    },
    errorText: {
      color: theme.warning,
      fontSize: 12,
      textAlign: isRTL ? 'right' : 'left',
    },
    loadingText: {
      color: theme.muted,
      fontSize: 12,
      textAlign: isRTL ? 'right' : 'left',
    },
    emptyText: {
      color: theme.muted,
      fontSize: 12,
      textAlign: isRTL ? 'right' : 'left',
    },
  });
