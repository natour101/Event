import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CategoryPill from '../components/CategoryPill';
import EventCard from '../components/EventCard';
import Icon from '../components/Icon';
import NotificationBell from '../components/NotificationBell';
import ScreenHeader from '../components/ScreenHeader';
import SectionHeader from '../components/SectionHeader';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import { categoryApi, homeApi } from '../services/api';
import { unwrapCollection } from '../utils/api';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const { user, token } = useAuth();
  const { unreadCount } = useNotifications();
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);
  const isAuthed = Boolean(user || token);
  const [homeData, setHomeData] = useState({
    featured: [],
    nearby: [],
    newest: [],
    stats: {},
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHome = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [homeResponse, categoryResponse] = await Promise.all([
        homeApi.getHome(),
        categoryApi.list(),
      ]);
      setHomeData({
        featured: unwrapCollection(homeResponse.data?.featured),
        nearby: unwrapCollection(homeResponse.data?.nearby),
        newest: unwrapCollection(homeResponse.data?.newest),
        stats: homeResponse.data?.stats || {},
      });
      setCategories(unwrapCollection(categoryResponse.data?.items));
    } catch (fetchError) {
      setError(fetchError?.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchHome();
  }, [fetchHome]);

  const handleAuthPress = action => {
    if (!isAuthed) {
      navigation.navigate('Profile');
      return;
    }
    action?.();
  };

  const stats = homeData.stats || {};
  const statItems = [
    { key: 'events', label: t('home.stats.events'), value: stats.events ?? 0 },
    { key: 'tournaments', label: t('home.stats.tournaments'), value: stats.tournaments ?? 0 },
    { key: 'users', label: t('home.stats.users'), value: stats.users ?? 0 },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchHome} />}
    >
      <ScreenHeader
        title={user?.name || t('home.greeting')}
        subtitle={user?.name ? t('home.greeting') : t('home.welcome')}
        rightElement={
          <NotificationBell
            count={unreadCount}
            onPress={() => handleAuthPress(() => navigation.navigate('Notifications'))}
          />
        }
      />
      <Pressable
        style={styles.searchRow}
        onPress={() => handleAuthPress(() => navigation.navigate('Explore', { focusSearch: true }))}
      >
        <Icon name="magnify" size={18} color={theme.muted} />
        <Text style={styles.searchPlaceholder}>{t('home.search')}</Text>
        <Pressable
          style={styles.filterIcon}
          onPress={event => {
            event?.stopPropagation?.();
            handleAuthPress(() => navigation.navigate('Explore', { focusFilter: true }));
          }}
        >
          <Icon name="tune-variant" size={18} color={theme.text} />
        </Pressable>
      </Pressable>

      <SectionHeader title={t('home.stats.title')} />
      <View style={styles.statsRow}>
        {statItems.map(item => (
          <View key={item.key} style={styles.statCard}>
            <Text style={styles.statValue}>{loading ? '—' : item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {loading ? <Text style={styles.loadingText}>{t('common.loading')}</Text> : null}

      <SectionHeader
        title={t('home.featured')}
        action={t('common.viewAll')}
        onActionPress={() => handleAuthPress(() => navigation.navigate('Explore'))}
      />
      {homeData.featured.map(event => (
        <EventCard
          key={event.id}
          event={{
            ...event,
            date: event.date_label,
          }}
          actionLabel={t('home.bookNow')}
          style={styles.featuredCard}
          onPress={() =>
            handleAuthPress(() => navigation.navigate('EventDetails', { eventId: event.id }))
          }
        />
      ))}
      {!loading && !error && homeData.featured.length === 0 ? (
        <Text style={styles.emptyText}>{t('common.empty')}</Text>
      ) : null}

      <View style={styles.categoryRow}>
        <CategoryPill label={t('categories.all')} active />
        {categories.map(category => (
          <CategoryPill key={category.id} label={category.name} />
        ))}
      </View>
      {!loading && !error && categories.length === 0 ? (
        <Text style={styles.emptyText}>{t('common.empty')}</Text>
      ) : null}

      <SectionHeader
        title={t('home.nearby')}
        action={t('common.viewAll')}
        onActionPress={() => handleAuthPress(() => navigation.navigate('Explore'))}
      />
      <View style={styles.nearbyRow}>
        {homeData.nearby.map(event => (
          <View key={event.id} style={styles.nearbyCard}>
            <EventCard
              event={{
                ...event,
                date: event.distance_km ? `${event.distance_km} كم` : event.date_label,
              }}
              actionLabel={event.distance_km ? `${event.distance_km} كم` : event.date_label}
              onPress={() =>
                handleAuthPress(() =>
                  navigation.navigate('EventDetails', { eventId: event.id })
                )
              }
            />
          </View>
        ))}
      </View>
      {!loading && !error && homeData.nearby.length === 0 ? (
        <Text style={styles.emptyText}>{t('common.empty')}</Text>
      ) : null}

      <SectionHeader
        title={t('home.newest')}
        action={t('common.viewAll')}
        onActionPress={() => handleAuthPress(() => navigation.navigate('Explore'))}
      />
      <View style={styles.list}>
        {homeData.newest.map(event => (
        <EventCard
          key={event.id}
          event={{
            ...event,
            date: event.date_label,
          }}
          actionLabel="+"
          onPress={() =>
            handleAuthPress(() => navigation.navigate('EventDetails', { eventId: event.id }))
          }
        />
      ))}
      </View>
      {!loading && !error && homeData.newest.length === 0 ? (
        <Text style={styles.emptyText}>{t('common.empty')}</Text>
      ) : null}
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
    statsRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      gap: 12,
      flexWrap: 'wrap',
    },
    statCard: {
      flexBasis: '30%',
      flexGrow: 1,
      minWidth: 110,
      padding: 14,
      borderRadius: 16,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: isRTL ? 'flex-end' : 'flex-start',
      gap: 6,
    },
    statValue: {
      color: theme.text,
      fontSize: 18,
      fontWeight: '700',
    },
    statLabel: {
      color: theme.muted,
      fontSize: 12,
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
    loadingText: {
      color: theme.muted,
      fontSize: 12,
    },
    emptyText: {
      color: theme.muted,
      fontSize: 12,
    },
  });
