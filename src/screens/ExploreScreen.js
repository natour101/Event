import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CategoryPill from '../components/CategoryPill';
import EventCard from '../components/EventCard';
import Icon from '../components/Icon';
import ScreenHeader from '../components/ScreenHeader';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { exploreEvents } from '../utils/mockData';

export default function ExploreScreen() {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader
        title={t('explore.title')}
        rightElement={<Icon name="arrow-left" size={18} color={theme.text} />}
      />
      <View style={styles.searchRow}>
        <Icon name="magnify" size={18} color={theme.muted} />
        <Text style={styles.searchPlaceholder}>{t('explore.search')}</Text>
        <View style={styles.filterIcon}>
          <Icon name="tune-variant" size={18} color={theme.text} />
        </View>
      </View>

      <View style={styles.categoryRow}>
        {[t('categories.all'), t('categories.music'), t('categories.arts'), t('categories.business'), t('categories.sports')].map(
          (item, index) => (
            <CategoryPill key={item} label={item} active={index === 0} />
          )
        )}
      </View>

      <Text style={styles.resultText}>{t('explore.results')}</Text>

      <View style={styles.list}>
        {exploreEvents.map(event => (
          <EventCard key={event.id} event={event} actionLabel={event.tag} />
        ))}
      </View>
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
      backgroundColor: theme.surfaceLight,
      width: 36,
      height: 36,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoryRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      gap: 10,
      flexWrap: 'wrap',
    },
    resultText: {
      color: theme.accent,
      fontSize: 12,
      textAlign: isRTL ? 'right' : 'left',
    },
    list: {
      gap: 14,
    },
  });
