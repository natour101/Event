import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CategoryPill from '../components/CategoryPill';
import Icon from '../components/Icon';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { categoryApi, eventsApi } from '../services/api';

const defaultForm = {
  title: '',
  subtitle: '',
  description: '',
  location: '',
  date: '',
  time: '',
  price: '',
  imageUrl: '',
};

export default function CreateEventScreen() {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);
  const [form, setForm] = useState(defaultForm);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoryApi.list();
      setCategories(response.data?.items || []);
    } catch (error) {
      setSubmitError(error?.message || t('common.error'));
    }
  }, [t]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const onChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.title) nextErrors.title = t('auth.errors.required');
    if (!form.location) nextErrors.location = t('auth.errors.required');
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const startAt = form.date && form.time ? `${form.date} ${form.time}` : null;
      await eventsApi.create({
        title: form.title,
        subtitle: form.subtitle,
        description: form.description,
        location: form.location,
        start_at: startAt,
        price: form.price ? Number(form.price) : 0,
        image_url: form.imageUrl || undefined,
        category_id: selectedCategory,
      });
      setForm(defaultForm);
      setSelectedCategory(null);
    } catch (error) {
      setSubmitError(error?.response?.message || error?.message || t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ScreenHeader
          title={t('create.title')}
          rightElement={<Icon name="arrow-left" size={18} color={theme.text} />}
        />

        <View style={styles.uploadBox}>
          <View style={styles.uploadIconWrap}>
            <Icon name="image-plus" size={24} color={theme.accent} />
          </View>
          <Text style={styles.uploadTitle} numberOfLines={1} ellipsizeMode="tail">
            {t('create.cover')}
          </Text>
          <Text style={styles.uploadSubtitle} numberOfLines={2} ellipsizeMode="tail">
            {t('create.coverHint')}
          </Text>
          <InputField
            label={t('create.cover')}
            placeholder="https://"
            value={form.imageUrl}
            onChangeText={value => onChange('imageUrl', value)}
          />
        </View>

        <InputField
          label={t('create.name')}
          placeholder={t('create.name')}
          value={form.title}
          onChangeText={value => onChange('title', value)}
        />
        {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}

        <InputField
          label={t('create.subtitle')}
          placeholder={t('create.subtitle')}
          value={form.subtitle}
          onChangeText={value => onChange('subtitle', value)}
        />

        <Text style={styles.sectionLabel}>{t('create.category')}</Text>
        <View style={styles.categoryRow}>
          {categories.map(category => (
            <CategoryPill
              key={category.id}
              label={category.name}
              active={selectedCategory === category.id}
              onPress={() => setSelectedCategory(category.id)}
            />
          ))}
        </View>

        <InputField
          label={t('create.description')}
          placeholder={t('create.descriptionHint')}
          multiline
          inputStyle={styles.textArea}
          value={form.description}
          onChangeText={value => onChange('description', value)}
        />

        <View style={styles.row}>
          <InputField
            label={t('create.date')}
            placeholder={t('create.datePlaceholder')}
            containerStyle={styles.flex}
            value={form.date}
            onChangeText={value => onChange('date', value)}
          />
          <InputField
            label={t('create.time')}
            placeholder={t('create.timePlaceholder')}
            containerStyle={styles.flex}
            value={form.time}
            onChangeText={value => onChange('time', value)}
          />
        </View>

        <PrimaryButton
          label={submitting ? t('common.loading') : t('create.publish')}
          onPress={onSubmit}
          style={submitting ? styles.disabledButton : null}
        />

        {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}

        <InputField
          label={t('create.locationSearch')}
          placeholder={t('create.locationPlaceholder')}
          value={form.location}
          onChangeText={value => onChange('location', value)}
        />
        {errors.location ? <Text style={styles.errorText}>{errors.location}</Text> : null}
        <View style={styles.mapBox}>
          <Icon name="map-marker-outline" size={18} color={theme.muted} />
          <Text style={styles.mapText}>{t('create.mapPreview')}</Text>
        </View>

        <Text style={styles.sectionLabel}>{t('create.ticketType')}</Text>
        <View style={styles.ticketRow}>
          <CategoryPill label={t('create.paid')} active />
          <CategoryPill label={t('create.free')} />
        </View>

        <InputField
          label={t('create.price')}
          placeholder={t('create.pricePlaceholder')}
          value={form.price}
          onChangeText={value => onChange('price', value)}
          keyboardType="numeric"
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
      paddingBottom: 32,
    },
    uploadBox: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.border,
      borderStyle: 'dashed',
      backgroundColor: theme.surface,
      padding: 20,
      alignItems: 'center',
      gap: 10,
    },
    uploadIconWrap: {
      width: 54,
      height: 54,
      borderRadius: 18,
      backgroundColor: 'rgba(245, 107, 29, 0.15)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    uploadTitle: {
      color: theme.text,
      fontWeight: '700',
      fontSize: 16,
    },
    uploadSubtitle: {
      color: theme.muted,
      fontSize: 12,
      textAlign: 'center',
      flexShrink: 1,
    },
    sectionLabel: {
      color: theme.text,
      fontSize: 14,
      textAlign: isRTL ? 'right' : 'left',
    },
    categoryRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    textArea: {
      minHeight: 90,
      textAlignVertical: 'top',
    },
    row: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      gap: 12,
    },
    flex: {
      flex: 1,
    },
    mapBox: {
      borderRadius: 18,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      paddingVertical: 30,
      alignItems: 'center',
      gap: 8,
    },
    mapText: {
      color: theme.muted,
    },
    ticketRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      gap: 12,
    },
    errorText: {
      color: theme.warning,
      fontSize: 12,
      textAlign: isRTL ? 'right' : 'left',
    },
    disabledButton: {
      opacity: 0.7,
    },
  });
