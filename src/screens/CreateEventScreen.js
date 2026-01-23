import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
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
  mapUrl: '',
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
    if (!form.mapUrl) {
      nextErrors.mapUrl = t('auth.errors.required');
    } else if (!form.mapUrl.startsWith('https://maps')) {
      nextErrors.mapUrl = t('create.mapLinkError');
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onPickCover = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });
    const asset = result?.assets?.[0];
    if (asset?.uri) {
      onChange('imageUrl', asset.uri);
    }
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
        map_url: form.mapUrl,
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
        <ScreenHeader title={t('create.title')} />

        <Pressable style={styles.uploadBox} onPress={onPickCover}>
          {form.imageUrl ? (
            <Image source={{ uri: form.imageUrl }} style={styles.coverPreview} />
          ) : (
            <>
              <View style={styles.uploadIconWrap}>
                <Icon name="image-plus" size={24} color={theme.accent} />
              </View>
              <Text style={styles.uploadTitle} numberOfLines={1} ellipsizeMode="tail">
                {t('create.cover')}
              </Text>
              <Text style={styles.uploadSubtitle} numberOfLines={2} ellipsizeMode="tail">
                {t('create.coverHint')}
              </Text>
              <Text style={styles.uploadAction}>{t('create.pickCover')}</Text>
            </>
          )}
        </Pressable>

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

        <InputField
          label={t('create.locationSearch')}
          placeholder={t('create.locationPlaceholder')}
          value={form.location}
          onChangeText={value => onChange('location', value)}
        />
        {errors.location ? <Text style={styles.errorText}>{errors.location}</Text> : null}
        <InputField
          label={t('create.mapLink')}
          placeholder={t('create.mapLinkPlaceholder')}
          value={form.mapUrl}
          onChangeText={value => onChange('mapUrl', value)}
          autoCapitalize="none"
        />
        {errors.mapUrl ? <Text style={styles.errorText}>{errors.mapUrl}</Text> : null}
        <Text style={styles.mapHint}>{t('create.mapLinkHint')}</Text>
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

        <PrimaryButton
          label={submitting ? t('common.loading') : t('create.publish')}
          onPress={onSubmit}
          style={submitting ? styles.disabledButton : null}
        />
        {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}
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
      overflow: 'hidden',
    },
    coverPreview: {
      width: '100%',
      height: 180,
      borderRadius: 16,
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
    uploadAction: {
      color: theme.accent,
      fontSize: 13,
      fontWeight: '600',
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
    mapHint: {
      color: theme.textDark,
      fontSize: 12,
      textAlign: isRTL ? 'right' : 'left',
      marginTop: -8,
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
