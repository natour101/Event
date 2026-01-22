import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { colors } from '../styles/colors';

export type EventCardData = {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  tag: string;
  image: string;
  price?: string;
};

type EventCardProps = {
  event: EventCardData;
  style?: ViewStyle;
  actionLabel?: string;
};

export default function EventCard({ event, style, actionLabel }: EventCardProps) {
  return (
    <View style={[styles.card, style]}>
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
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.subtitle}>{event.subtitle}</Text>
        <View style={styles.footer}>
          <Text style={styles.date}>{event.date}</Text>
          {actionLabel ? (
            <View style={styles.actionChip}>
              <Text style={styles.actionText}>{actionLabel}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
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
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  tagText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 14,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'right',
  },
  subtitle: {
    color: colors.textDark,
    fontSize: 13,
    marginTop: 6,
    textAlign: 'right',
  },
  footer: {
    marginTop: 12,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    color: colors.muted,
    fontSize: 12,
  },
  actionChip: {
    backgroundColor: colors.surfaceLight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  actionText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
});
