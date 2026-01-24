import React, { useMemo } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { resolveMediaUrl } from '../utils/media';
import Icon from './Icon';

export default function EventCard({ event, style, actionLabel, onPress }) {
  const { theme } = useTheme();
  const { isRTL, t } = useLanguage();
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);

  const imageUrl = resolveMediaUrl(event?.image || event?.image_url);
  const priceLabel =
    event?.price === 0
      ? t('common.free')
      : event?.price
        ? `${event.price} ${t('common.currency')}`
        : null;
  const metaItems = [
    event?.location ? { icon: 'map-marker', text: event.location } : null,
    priceLabel ? { icon: 'cash', text: priceLabel } : null,
    typeof event?.rating === 'number'
      ? { icon: 'star', text: `${event.rating} ${t('common.rating')}` }
      : null,
    typeof event?.views === 'number'
      ? { icon: 'eye', text: `${event.views} ${t('common.views')}` }
      : null,
    typeof event?.attendees === 'number'
      ? { icon: 'account-group', text: `${event.attendees} ${t('eventDetails.attendees')}` }
      : null,
  ].filter(Boolean);

  return (
    <Pressable style={[styles.card, style]} onPress={onPress} disabled={!onPress}>
      <ImageBackground
        source={{ uri: imageUrl }}
        style={styles.image}
        imageStyle={styles.imageRadius}
      >
        <View style={styles.tag}>
          <Text style={styles.tagText}>{event.tag}</Text>
        </View>
      </ImageBackground>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {event.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2} ellipsizeMode="tail">
          {event.subtitle}
        </Text>
        {metaItems.length ? (
          <View style={styles.metaRow}>
            {metaItems.map((item, index) => (
              <View key={`${item.text}-${index}`} style={styles.metaItem}>
                <Icon name={item.icon} size={12} color={theme.muted} />
                <Text style={styles.metaText} numberOfLines={1} ellipsizeMode="tail">
                  {item.text}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
        <View style={styles.footer}>
          <Text style={styles.date}>{event.date}</Text>
          {actionLabel ? (
            <View style={styles.actionChip}>
              <Text style={styles.actionText}>{actionLabel}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const createStyles = (theme, isRTL) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderRadius: 18,
      overflow: 'hidden',
    },
    image: {
      height: 140,
      justifyContent: 'flex-end',
      padding: 12,
    },
    imageRadius: {
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
    },
    tag: {
      alignSelf: isRTL ? 'flex-end' : 'flex-start',
      backgroundColor: 'rgba(0,0,0,0.45)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 14,
    },
    tagText: {
      color: theme.text,
      fontSize: 12,
      fontWeight: '600',
    },
    content: {
      padding: 14,
    },
    title: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '700',
      textAlign: isRTL ? 'right' : 'left',
    },
    subtitle: {
      color: theme.textDark,
      fontSize: 13,
      marginTop: 6,
      textAlign: isRTL ? 'right' : 'left',
    },
    metaRow: {
      marginTop: 8,
      flexDirection: isRTL ? 'row-reverse' : 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    metaItem: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 4,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 12,
      backgroundColor: theme.surfaceLight,
      maxWidth: '100%',
    },
    metaText: {
      color: theme.muted,
      fontSize: 11,
    },
    footer: {
      marginTop: 12,
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    date: {
      color: theme.muted,
      fontSize: 12,
    },
    actionChip: {
      backgroundColor: theme.surfaceLight,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 12,
    },
    actionText: {
      color: theme.text,
      fontSize: 12,
      fontWeight: '600',
    },
  });
