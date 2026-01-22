import React, { useMemo } from 'react';
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
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { featuredEvents, nearbyEvents, newestEvents } from '../utils/mockData';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader
        title={t('home.userName')}
        subtitle={t('home.greeting')}
        rightElement={<Icon name="bell-outline" size={20} color={theme.text} />}
      />
      <View style={styles.searchRow}>
        <Icon name="magnify" size={18} color={theme.muted} />
        <Text style={styles.searchPlaceholder}>{t('home.search')}</Text>
        <View style={styles.filterIcon}>
          <Icon name="tune-variant" size={18} color={theme.text} />
        </View>
      </View>

      <SectionHeader title={t('home.featured')} action={t('common.viewAll')} />
      {featuredEvents.map(event => (
        <EventCard
          key={event.id}
          event={event}
          actionLabel={t('home.bookNow')}
          style={styles.featuredCard}
        />
      ))}

      <View style={styles.categoryRow}>
        {[t('categories.all'), t('categories.music'), t('categories.arts'), t('categories.sports'), t('categories.business')].map(
          (item, index) => (
            <CategoryPill key={item} label={item} active={index === 0} />
          )
        )}
      </View>

      <SectionHeader title={t('home.nearby')} action={t('common.viewAll')} />
      <View style={styles.nearbyRow}>
        {nearbyEvents.map(event => (
          <View key={event.id} style={styles.nearbyCard}>
            <EventCard event={event} actionLabel={event.date} />
          </View>
        ))}
      </View>

      <SectionHeader title={t('home.newest')} action={t('common.viewAll')} />
      <View style={styles.list}>
        {newestEvents.map(event => (
          <EventCard key={event.id} event={event} actionLabel="+" />
        ))}
      </View>
    </ScrollView>
  );
}

const cardWidth = width * 0.68;

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
    searchRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: 20,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderColor: theme.border,
      borderWidth: 1,
      gap: 8,
    },
    searchPlaceholder: {
      flex: 1,
      color: theme.muted,
      fontSize: 14,
      textAlign: isRTL ? 'right' : 'left',
    },
    filterIcon: {
      backgroundColor: theme.accent,
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
      flexDirection: isRTL ? 'row-reverse' : 'row',
      gap: 10,
      flexWrap: 'wrap',
    },
    nearbyRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      gap: 14,
    },
    nearbyCard: {
      width: cardWidth,
    },
    list: {
      gap: 14,
    },
  });
