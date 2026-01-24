import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ImageBackground,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from '../components/Icon';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { API_CONFIG } from '../constants/api';
import { eventsApi } from '../services/api';

export default function EventDetailsScreen({ route }) {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const eventId = route?.params?.eventId;

  const fetchEvent = useCallback(async () => {
    if (!eventId) return;
    setError('');
    try {
      const response = await eventsApi.show(eventId);
      setEvent(response.data?.event || null);
    } catch (fetchError) {
      setError(fetchError?.message || t('common.error'));
    }
  }, [eventId, t]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const mapUrl = event?.map_url || event?.map_link || event?.map;
  const shareUrl = `${API_CONFIG.BASE_URL.replace(/\/api\/?$/, '')}/events/${eventId}`;
  const priceLabel = event?.price
    ? `${event.price} ${t('common.currency')}`
    : t('common.free');

  const onShare = async () => {
    setActionError('');
    try {
      await Share.share({
        message: shareUrl,
      });
    } catch (shareError) {
      setActionError(shareError?.message || t('common.error'));
    }
  };

  const onToggleLike = async () => {
    if (!eventId) return;
    setActionError('');
    setIsLiking(true);
    try {
      const response = event?.liked_by_me
        ? await eventsApi.unlike(eventId)
        : await eventsApi.like(eventId);
      setEvent(response.data?.event || event);
    } catch (likeError) {
      setActionError(likeError?.message || t('common.error'));
    } finally {
      setIsLiking(false);
    }
  };

  const onBook = async () => {
    if (!eventId) return;
    setActionError('');
    setIsBooking(true);
    try {
      const response = await eventsApi.book(eventId);
      setEvent(response.data?.event || event);
    } catch (bookError) {
      setActionError(bookError?.message || t('common.error'));
    } finally {
      setIsBooking(false);
    }
  };

  if (!eventId) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.errorText}>{t('common.empty')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {event?.image ? (
        <ImageBackground
          source={{ uri: event.image }}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroActions}>
            <Pressable style={styles.iconButton} onPress={onShare}>
              <Icon name="share-variant" size={16} color={theme.text} />
            </Pressable>
            <Pressable style={styles.iconButton} onPress={onToggleLike} disabled={isLiking}>
              <Icon
                name={event?.liked_by_me ? 'heart' : 'heart-outline'}
                size={16}
                color={event?.liked_by_me ? theme.accent : theme.text}
              />
            </Pressable>
          </View>
        </ImageBackground>
      ) : null}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <ScreenHeader
        title={event?.title || t('eventDetails.organizer')}
        rightElement={<Icon name="ticket-confirmation" size={18} color={theme.text} />}
      />
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>
          {event?.attendees
            ? `${event.attendees} ${t('eventDetails.attendees')}`
            : null}
        </Text>
        <Text style={styles.metaText}>
          {event?.rating ? `⭐ ${event.rating}` : null}
        </Text>
        <Text style={styles.likeCount}>
          {typeof event?.likes_count === 'number'
            ? `${event.likes_count} ${t('eventDetails.likes')}`
            : null}
        </Text>
      </View>

      <View style={styles.hostRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {event?.organizer?.name?.slice(0, 1) || 'م'}
          </Text>
        </View>
        <View style={styles.hostInfo}>
          <Text style={styles.hostLabel}>{t('eventDetails.organizer')}</Text>
          <Text style={styles.hostName} numberOfLines={1} ellipsizeMode="tail">
            {event?.organizer?.name || t('eventDetails.organizer')}
          </Text>
        </View>
        <PrimaryButton label={t('common.follow')} variant="secondary" />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('eventDetails.timeDate')}</Text>
        <Text style={styles.cardValue}>{event?.date_label}</Text>
        {event?.end_at ? <Text style={styles.cardValue}>{event.end_at}</Text> : null}
        <Text style={styles.cardLink}>{t('eventDetails.addCalendar')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('eventDetails.location')}</Text>
        <Text style={styles.cardValue}>{event?.location}</Text>
        <Pressable
          style={[styles.mapPreview, !mapUrl && styles.mapPreviewDisabled]}
          onPress={() => (mapUrl ? Linking.openURL(mapUrl) : null)}
          disabled={!mapUrl}
        >
          <Icon name="map-outline" size={18} color="#2f1c14" />
          <Text style={styles.mapText}>{t('eventDetails.openMap')}</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('eventDetails.about')}</Text>
        <Text style={styles.cardValue}>{event?.description}</Text>
        <Text style={styles.cardLink}>{t('eventDetails.readMore')}</Text>
      </View>

      <PrimaryButton
        label={
          event?.booked_by_me ? t('eventDetails.booked') : t('eventDetails.registerNow')
        }
        iconComponent={<Icon name="arrow-left" size={18} color={theme.text} />}
        onPress={onBook}
        style={isBooking || event?.booked_by_me ? styles.disabledButton : null}
        disabled={isBooking || event?.booked_by_me}
      />
      {actionError ? <Text style={styles.errorText}>{actionError}</Text> : null}
      <Text style={styles.priceText}>{priceLabel}</Text>
      {event?.booked_users?.length ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('eventDetails.bookedUsers')}</Text>
          <View style={styles.userChips}>
            {event.booked_users.map(name => (
              <View key={name} style={styles.userChip}>
                <Text style={styles.userChipText}>{name}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
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
    hero: {
      height: 220,
      borderRadius: 22,
      overflow: 'hidden',
    },
    heroImage: {
      borderRadius: 22,
    },
    heroActions: {
      flexDirection: 'row',
      gap: 12,
      alignSelf: 'flex-end',
      padding: 16,
    },
    iconButton: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: 'rgba(0,0,0,0.35)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    metaRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      gap: 12,
      flexWrap: 'wrap',
    },
    metaText: {
      color: theme.muted,
      fontSize: 12,
    },
    likeCount: {
      color: theme.accent,
      fontSize: 12,
      fontWeight: '700',
    },
    hostRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 12,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.surfaceLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      color: theme.text,
      fontWeight: '700',
    },
    hostInfo: {
      flex: 1,
      alignItems: isRTL ? 'flex-end' : 'flex-start',
    },
    hostLabel: {
      color: theme.muted,
      fontSize: 12,
    },
    hostName: {
      color: theme.text,
      fontSize: 14,
      fontWeight: '700',
      marginTop: 4,
      flexShrink: 1,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 18,
      padding: 16,
      gap: 8,
    },
    cardTitle: {
      color: theme.text,
      fontSize: 15,
      fontWeight: '700',
      textAlign: isRTL ? 'right' : 'left',
    },
    cardValue: {
      color: theme.textDark,
      fontSize: 13,
      lineHeight: 20,
      textAlign: isRTL ? 'right' : 'left',
      flexShrink: 1,
    },
    cardLink: {
      color: theme.accent,
      fontSize: 12,
      textAlign: isRTL ? 'right' : 'left',
    },
    mapPreview: {
      height: 110,
      borderRadius: 14,
      backgroundColor: '#f0e6da',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },
    mapPreviewDisabled: {
      opacity: 0.6,
    },
    mapText: {
      color: '#2f1c14',
      fontWeight: '600',
    },
    priceText: {
      color: theme.text,
      textAlign: 'center',
      fontWeight: '700',
      marginBottom: 20,
    },
    errorText: {
      color: theme.warning,
      fontSize: 12,
      textAlign: isRTL ? 'right' : 'left',
    },
    disabledButton: {
      opacity: 0.7,
    },
    userChips: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    userChip: {
      backgroundColor: theme.surfaceLight,
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: theme.border,
    },
    userChipText: {
      color: theme.text,
      fontSize: 12,
      fontWeight: '600',
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.background,
    },
  });
