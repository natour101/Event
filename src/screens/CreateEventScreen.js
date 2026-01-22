import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CategoryPill from '../components/CategoryPill';
import Icon from '../components/Icon';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function CreateEventScreen() {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader
        title={t('create.title')}
        rightElement={<Icon name="arrow-left" size={18} color={theme.text} />}
      />

      <View style={styles.uploadBox}>
        <View style={styles.uploadIconWrap}>
          <Icon name="image-plus" size={24} color={theme.accent} />
        </View>
        <Text style={styles.uploadTitle}>{t('create.cover')}</Text>
        <Text style={styles.uploadSubtitle}>{t('create.coverHint')}</Text>
        <PrimaryButton label={t('create.upload')} variant="secondary" />
      </View>

      <InputField label={t('create.name')} placeholder={t('create.name')} />

      <Text style={styles.sectionLabel}>{t('create.category')}</Text>
      <View style={styles.categoryRow}>
        {[t('categories.tech'), t('categories.business'), t('categories.fun'), t('categories.arts'), t('categories.sports')].map(
          (item, index) => (
            <CategoryPill key={item} label={item} active={index === 0} />
          )
        )}
      </View>

      <InputField
        label={t('create.description')}
        placeholder={t('create.descriptionHint')}
        multiline
        inputStyle={styles.textArea}
      />

      <View style={styles.row}>
        <InputField
          label={t('create.date')}
          placeholder={t('create.datePlaceholder')}
          containerStyle={styles.flex}
        />
        <InputField
          label={t('create.time')}
          placeholder={t('create.timePlaceholder')}
          containerStyle={styles.flex}
        />
      </View>

      <PrimaryButton label={t('create.publish')} />

      <InputField
        label={t('create.locationSearch')}
        placeholder={t('create.locationPlaceholder')}
      />
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
      />
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
  });
