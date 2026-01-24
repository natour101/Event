import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import CategoryPill from '../components/CategoryPill';
import Icon from '../components/Icon';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { categoryApi, eventsApi } from '../services/api';

const defaultForm = {
  title: '',
  subtitle: '',
  description: '',
  location: '',
  price: '',
};

export default function CreateEventScreen() {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const { user, token } = useAuth();
  const navigation = useNavigation();
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);
  const isAuthed = Boolean(user || token);
  const [form, setForm] = useState(defaultForm);
  const [imageAsset, setImageAsset] = useState(null);
  const [dateValue, setDateValue] = useState(null);
  const [timeValue, setTimeValue] = useState(null);
  const [pickerMode, setPickerMode] = useState(null);
  const [pickerValue, setPickerValue] = useState(new Date());
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [ticketType, setTicketType] = useState('paid');
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

  useEffect(() => {
    if (!isAuthed) {
      navigation.navigate('Profile');
    }
  }, [isAuthed, navigation]);

  const handleAuthPress = action => {
    if (!isAuthed) {
      navigation.navigate('Profile');
      return;
    }
    action?.();
  };

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

  const onPickCover = () => {
    handleAuthPress(async () => {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });
      const asset = result?.assets?.[0];
      if (asset?.uri) {
        setImageAsset(asset);
      }
    });
  };

  const onSubmit = () => {
    handleAuthPress(async () => {
      if (!validate()) return;
      setSubmitting(true);
      setSubmitError('');
      try {
        const startAt = dateValue
          ? new Date(
              dateValue.getFullYear(),
              dateValue.getMonth(),
              dateValue.getDate(),
              timeValue ? timeValue.getHours() : 0,
              timeValue ? timeValue.getMinutes() : 0
            ).toISOString()
          : null;
        const priceValue = ticketType === 'free' ? 0 : Number(form.price || 0);
        const payload = new FormData();
        payload.append('title', form.title);
        if (form.subtitle) payload.append('subtitle', form.subtitle);
        if (form.description) payload.append('description', form.description);
        if (form.location) payload.append('location', form.location);
        if (startAt) payload.append('start_at', startAt);
        payload.append('price', String(priceValue));
        if (selectedCategory) payload.append('category_id', String(selectedCategory));
        if (imageAsset?.uri) {
          payload.append('image', {
            uri: imageAsset.uri,
            type: imageAsset.type || 'image/jpeg',
            name: imageAsset.fileName || `event-${Date.now()}.jpg`,
          });
        }
        await eventsApi.create(payload);
        setForm(defaultForm);
        setImageAsset(null);
        setDateValue(null);
        setTimeValue(null);
        setSelectedCategory(null);
        setTicketType('paid');
      } catch (error) {
        setSubmitError(error?.response?.message || error?.message || t('common.error'));
      } finally {
        setSubmitting(false);
      }
    });
  };

  const formatDate = value => {
    if (!value) return t('create.datePlaceholder');
    const day = String(value.getDate()).padStart(2, '0');
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const year = value.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const formatTime = value => {
    if (!value) return t('create.timePlaceholder');
    const hours = String(value.getHours()).padStart(2, '0');
    const minutes = String(value.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const openPicker = mode => {
    setPickerMode(mode);
    setPickerValue(mode === 'date' ? dateValue || new Date() : timeValue || new Date());
  };

  const closePicker = () => {
    setPickerMode(null);
  };

  const confirmPicker = () => {
    if (pickerMode === 'date') {
      setDateValue(pickerValue);
    }
    if (pickerMode === 'time') {
      setTimeValue(pickerValue);
    }
    closePicker();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ScreenHeader title={t('create.title')} />

        <Pressable style={styles.uploadBox} onPress={onPickCover}>
          {imageAsset?.uri ? (
            <Image source={{ uri: imageAsset.uri }} style={styles.coverPreview} />
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
              onPress={() => handleAuthPress(() => setSelectedCategory(category.id))}
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
            value={dateValue ? formatDate(dateValue) : ''}
            containerStyle={styles.flex}
            editable={false}
            showSoftInputOnFocus={false}
            onPressIn={() => handleAuthPress(() => openPicker('date'))}
            trailingIcon={<Icon name="calendar" size={18} color={theme.muted} />}
          />
          <InputField
            label={t('create.time')}
            placeholder={t('create.timePlaceholder')}
            value={timeValue ? formatTime(timeValue) : ''}
            containerStyle={styles.flex}
            editable={false}
            showSoftInputOnFocus={false}
            onPressIn={() => handleAuthPress(() => openPicker('time'))}
            trailingIcon={<Icon name="clock-outline" size={18} color={theme.muted} />}
          />
        </View>

        <InputField
          label={t('create.locationLabel')}
          placeholder={t('create.locationPlaceholder')}
          value={form.location}
          onChangeText={value => onChange('location', value)}
        />
        {errors.location ? <Text style={styles.errorText}>{errors.location}</Text> : null}

        <Text style={styles.sectionLabel}>{t('create.ticketType')}</Text>
        <View style={styles.ticketRow}>
          <CategoryPill
            label={t('create.paid')}
            active={ticketType === 'paid'}
            onPress={() => handleAuthPress(() => setTicketType('paid'))}
          />
          <CategoryPill
            label={t('create.free')}
            active={ticketType === 'free'}
            onPress={() => {
              handleAuthPress(() => {
                setTicketType('free');
                onChange('price', '0');
              });
            }}
          />
        </View>

        <InputField
          label={t('create.price')}
          placeholder={t('create.pricePlaceholder')}
          value={form.price}
          onChangeText={value => onChange('price', value)}
          keyboardType="numeric"
          editable={ticketType === 'paid'}
        />

        <PrimaryButton
          label={submitting ? t('common.loading') : t('create.publish')}
          onPress={onSubmit}
          style={submitting ? styles.disabledButton : null}
          disabled={submitting}
        />
        {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}
      </ScrollView>

      <Modal visible={Boolean(pickerMode)} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {pickerMode === 'date' ? t('create.date') : t('create.time')}
            </Text>
            <DateTimePicker
              value={pickerValue}
              mode={pickerMode === 'date' ? 'date' : 'time'}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setPickerValue(selectedDate);
                }
                if (Platform.OS !== 'ios' && event.type === 'set') {
                  if (pickerMode === 'date') {
                    setDateValue(selectedDate);
                  } else {
                    setTimeValue(selectedDate);
                  }
                  closePicker();
                }
                if (Platform.OS !== 'ios' && event.type === 'dismissed') {
                  closePicker();
                }
              }}
            />
            {Platform.OS === 'ios' ? (
              <View style={styles.modalActions}>
                <Pressable style={styles.modalButton} onPress={closePicker}>
                  <Text style={styles.modalButtonText}>{t('common.cancel')}</Text>
                </Pressable>
                <Pressable style={styles.modalButton} onPress={confirmPicker}>
                  <Text style={styles.modalButtonText}>{t('common.confirm')}</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        </View>
      </Modal>
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
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'flex-end',
    },
    modalCard: {
      backgroundColor: theme.surface,
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    modalTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 12,
      textAlign: isRTL ? 'right' : 'left',
    },
    modalActions: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      marginTop: 12,
    },
    modalButton: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: theme.surfaceLight,
      borderWidth: 1,
      borderColor: theme.border,
      minWidth: 100,
      alignItems: 'center',
    },
    modalButtonText: {
      color: theme.text,
      fontSize: 14,
      fontWeight: '600',
    },
  });
