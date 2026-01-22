import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CategoryPill from '../components/CategoryPill';
import EventCard from '../components/EventCard';
import Icon from '../components/Icon';
import ScreenHeader from '../components/ScreenHeader';
import SectionHeader from '../components/SectionHeader';
import { colors } from '../styles/colors';
import { featuredEvents, nearbyEvents, newestEvents } from '../utils/mockData';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader
        title="أحمد محمد"
        subtitle="مرحباً بك 👋"
        rightElement={<Icon name="bell-outline" size={20} color={colors.text} />}
      />
      <View style={styles.searchRow}>
        <Icon name="magnify" size={18} color={colors.muted} />
        <Text style={styles.searchPlaceholder}>ابحث عن فعاليات...</Text>
        <View style={styles.filterIcon}>
          <Icon name="tune-variant" size={18} color={colors.text} />
        </View>
      </View>

      <SectionHeader title="فعاليات مميزة" action="عرض الكل" />
      {featuredEvents.map(event => (
        <EventCard
          key={event.id}
          event={event}
          actionLabel="احجز الآن"
          style={styles.featuredCard}
        />
      ))}

      <View style={styles.categoryRow}>
        {['الكل', 'موسيقى', 'فنون', 'رياضة', 'أعمال'].map((item, index) => (
          <CategoryPill key={item} label={item} active={index === 0} />
        ))}
      </View>

      <SectionHeader title="أحداث قريبة منك" action="عرض الكل" />
      <View style={styles.nearbyRow}>
        {nearbyEvents.map(event => (
          <View key={event.id} style={styles.nearbyCard}>
            <EventCard event={event} actionLabel={event.date} />
          </View>
        ))}
      </View>

      <SectionHeader title="أحدث الفعاليات" action="عرض الكل" />
      <View style={styles.list}>
        {newestEvents.map(event => (
          <EventCard key={event.id} event={event} actionLabel="+" />
        ))}
      </View>
    </ScrollView>
  );
}

const cardWidth = width * 0.68;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  searchRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderColor: colors.border,
    borderWidth: 1,
    gap: 8,
  },
  searchPlaceholder: {
    flex: 1,
    color: colors.muted,
    fontSize: 14,
    textAlign: 'right',
  },
  filterIcon: {
    backgroundColor: colors.accent,
    width: 36,
    height: 36,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredCard: {
    marginTop: 8,
  },
  categoryRow: {
    flexDirection: 'row-reverse',
    gap: 10,
    flexWrap: 'wrap',
  },
  nearbyRow: {
    flexDirection: 'row-reverse',
    gap: 14,
  },
  nearbyCard: {
    width: cardWidth,
  },
  list: {
    gap: 14,
  },
});
