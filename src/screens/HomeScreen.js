import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  RefreshControl,
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
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { categoryApi, homeApi } from '../services/api';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const { user } = useAuth();
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);
  const [homeData, setHomeData] = useState({
    featured: [],
    nearby: [],
    newest: [],
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHome = useCallback(async () => {
    setError('');
    try {
      const [homeResponse, categoryResponse] = await Promise.all([
        homeApi.getHome(),
        categoryApi.list(),
      ]);
      setHomeData({
        featured: homeResponse.data?.featured || [],
        nearby: homeResponse.data?.nearby || [],
        newest: homeResponse.data?.newest || [],
      });
      setCategories(categoryResponse.data?.items || []);
    } catch (fetchError) {
      setError(fetchError?.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchHome();
  }, [fetchHome]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchHome} />}
    >
      <ScreenHeader
        title={user?.name || t('home.userName')}
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
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {homeData.featured.map(event => (
        <EventCard
          key={event.id}
          event={{
            ...event,
            date: event.date_label,
          }}
          actionLabel={t('home.bookNow')}
          style={styles.featuredCard}
          onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
        />
      ))}

      <View style={styles.categoryRow}>
        <CategoryPill label={t('categories.all')} active />
        {categories.map(category => (
          <CategoryPill key={category.id} label={category.name} />
        ))}
      </View>

      <SectionHeader title={t('home.nearby')} action={t('common.viewAll')} />
      <View style={styles.nearbyRow}>
        {homeData.nearby.map(event => (
          <View key={event.id} style={styles.nearbyCard}>
            <EventCard
              event={{
                ...event,
                date: event.distance_km ? `${event.distance_km} كم` : event.date_label,
              }}
              actionLabel={event.distance_km ? `${event.distance_km} كم` : event.date_label}
              onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
            />
          </View>
        ))}
      </View>

      <SectionHeader title={t('home.newest')} action={t('common.viewAll')} />
      <View style={styles.list}>
        {homeData.newest.map(event => (
          <EventCard
            key={event.id}
            event={{
              ...event,
              date: event.date_label,
            }}
            actionLabel="+"
            onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
          />
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
    errorText: {
      color: theme.warning,
      fontSize: 12,
    },
  });
