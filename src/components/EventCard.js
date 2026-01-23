import React, { useMemo } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function EventCard({ event, style, actionLabel, onPress }) {
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);

  return (
    <Pressable style={[styles.card, style]} onPress={onPress} disabled={!onPress}>
      <ImageBackground
        source={{ uri: event.image }}
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
