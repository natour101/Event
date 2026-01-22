import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CategoryPill from '../components/CategoryPill';
import EventCard from '../components/EventCard';
import Icon from '../components/Icon';
import ScreenHeader from '../components/ScreenHeader';
import { colors } from '../styles/colors';
import { exploreEvents } from '../utils/mockData';

export default function ExploreScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader
        title="استكشف الفعاليات"
        rightElement={<Icon name="arrow-left" size={18} color={colors.text} />}
      />
      <View style={styles.searchRow}>
        <Icon name="magnify" size={18} color={colors.muted} />
        <Text style={styles.searchPlaceholder}>ابحث عن فعالية، فنان، أو مكان...</Text>
        <View style={styles.filterIcon}>
          <Icon name="tune-variant" size={18} color={colors.text} />
        </View>
      </View>

      <View style={styles.categoryRow}>
        {['الكل', 'موسيقى', 'فنون', 'أعمال', 'رياضة'].map((item, index) => (
          <CategoryPill key={item} label={item} active={index === 0} />
        ))}
      </View>

      <Text style={styles.resultText}>عرض 24 نتيجة</Text>

      <View style={styles.list}>
        {exploreEvents.map(event => (
          <EventCard key={event.id} event={event} actionLabel={event.tag} />
        ))}
      </View>
    </ScrollView>
  );
}

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
    backgroundColor: colors.surfaceLight,
    width: 36,
    height: 36,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryRow: {
    flexDirection: 'row-reverse',
    gap: 10,
    flexWrap: 'wrap',
  },
  resultText: {
    color: colors.accent,
    fontSize: 12,
    textAlign: 'right',
  },
  list: {
    gap: 14,
  },
});
