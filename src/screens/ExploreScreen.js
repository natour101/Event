import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import CategoryPill from '../components/CategoryPill';
import EventCard from '../components/EventCard';
import Icon from '../components/Icon';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { categoryApi, eventsApi } from '../services/api';
import { unwrapCollection } from '../utils/api';

export default function ExploreScreen({ navigation, route }) {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const { user, token } = useAuth();
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);
  const searchInputRef = useRef(null);
  const scrollRef = useRef(null);
  const isAuthed = Boolean(user || token);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoryApi.list();
      setCategories(unwrapCollection(response.data?.items));
    } catch (fetchError) {
      setError(fetchError?.message || t('common.error'));
    }
  }, [t]);

  const fetchEvents = useCallback(async (pageNumber = 1, reset = false) => {
    setLoading(true);
    setError('');
    try {
      const response = await eventsApi.list({
        page: pageNumber,
        search: search || undefined,
        category_id: selectedCategory || undefined,
      });
      const nextItems = unwrapCollection(response.data?.items);
      setEvents(prev => (reset ? nextItems : [...prev, ...nextItems]));
      const pagination = response.data?.pagination;
      setTotal(pagination?.total || nextItems.length);
      setHasMore(pagination ? pagination.current_page < pagination.last_page : false);
      setPage(pageNumber);
    } catch (fetchError) {
      setError(fetchError?.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, t]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchEvents(1, true);
  }, [fetchEvents]);

  useEffect(() => {
    if (route?.params?.focusSearch) {
      searchInputRef.current?.focus();
    }
  }, [route?.params?.focusSearch]);

  useEffect(() => {
    if (route?.params?.focusFilter) {
      const timer = setTimeout(() => {
        scrollRef.current?.scrollTo({ y: 200, animated: true });
      }, 250);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [route?.params?.focusFilter]);

  const handleAuthPress = action => {
    if (!isAuthed) {
      navigation.navigate('Profile');
      searchInputRef.current?.blur?.();
      return false;
    }
    action?.();
    return true;
  };

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <ScreenHeader title={t('explore.title')} />
      <View style={styles.searchRow}>
        <Icon name="magnify" size={18} color={theme.muted} />
        <TextInput
          ref={searchInputRef}
          style={styles.searchInput}
          placeholder={t('explore.search')}
          placeholderTextColor={theme.muted}
          value={search}
          onChangeText={value => setSearch(value)}
          onSubmitEditing={() =>
            handleAuthPress(() => {
              fetchEvents(1, true);
            })
          }
          onFocus={() => handleAuthPress()}
        />
        <View style={styles.filterIcon}>
          <Icon name="tune-variant" size={18} color={theme.text} />
        </View>
      </View>

      <View style={styles.categoryRow}>
        <CategoryPill
          label={t('categories.all')}
          active={!selectedCategory}
          onPress={() => handleAuthPress(() => setSelectedCategory(null))}
        />
        {categories.map(category => (
          <CategoryPill
            key={category.id}
            label={category.name}
            active={selectedCategory === category.id}
            onPress={() => handleAuthPress(() => setSelectedCategory(category.id))}
          />
        ))}
      </View>

      <Text style={styles.resultText}>
        {t('explore.results')} ({total})
      </Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.list}>
        {events.map(event => (
          <EventCard
            key={event.id}
            event={{
              ...event,
              date: event.date_label,
            }}
            actionLabel={event.tag}
            onPress={() =>
              handleAuthPress(() => navigation.navigate('EventDetails', { eventId: event.id }))
            }
          />
        ))}
      </View>
      {hasMore ? (
        <PrimaryButton
          label={loading ? t('common.loading') : t('common.viewAll')}
          variant="secondary"
          onPress={() => handleAuthPress(() => fetchEvents(page + 1))}
          style={styles.loadMoreButton}
        />
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
    searchInput: {
      flex: 1,
      color: theme.text,
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
    loadMoreButton: {
      marginTop: 6,
    },
    errorText: {
      color: theme.warning,
      fontSize: 12,
      textAlign: isRTL ? 'right' : 'left',
    },
  });
