import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CategoryPill from '../components/CategoryPill';
import Icon from '../components/Icon';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import { colors } from '../styles/colors';

export default function CreateEventScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader
        title="إنشاء حدث"
        rightElement={<Icon name="arrow-left" size={18} color={colors.text} />}
      />

      <View style={styles.uploadBox}>
        <View style={styles.uploadIconWrap}>
          <Icon name="image-plus" size={24} color={colors.accent} />
        </View>
        <Text style={styles.uploadTitle}>صورة الغلاف</Text>
        <Text style={styles.uploadSubtitle}>أضف صورة جذابة للحدث (16:9)</Text>
        <PrimaryButton label="رفع صورة" variant="secondary" />
      </View>

      <InputField label="اسم الحدث" placeholder="مثال: مؤتمر التقنية السنوي 2024" />

      <Text style={styles.sectionLabel}>التصنيف</Text>
      <View style={styles.categoryRow}>
        {['تقنية', 'أعمال', 'ترفيه', 'فنون', 'رياضة'].map((item, index) => (
          <CategoryPill key={item} label={item} active={index === 0} />
        ))}
      </View>

      <InputField
        label="وصف الحدث"
        placeholder="اكتب وصفاً مختصراً للحدث..."
        multiline
        inputStyle={styles.textArea}
      />

      <View style={styles.row}>
        <InputField
          label="التاريخ"
          placeholder="12 نوفمبر"
          containerStyle={styles.flex}
        />
        <InputField
          label="وقت البدء"
          placeholder="09:00 م"
          containerStyle={styles.flex}
        />
      </View>

      <PrimaryButton label="نشر الحدث" />

      <InputField label="ابحث عن موقع..." placeholder="واجهة الرياض" />
      <View style={styles.mapBox}>
        <Icon name="map-marker-outline" size={18} color={colors.muted} />
        <Text style={styles.mapText}>الخريطة للمعاينة</Text>
      </View>

      <Text style={styles.sectionLabel}>نوع التذكرة</Text>
      <View style={styles.ticketRow}>
        <CategoryPill label="مدفوع" active />
        <CategoryPill label="مجاني" />
      </View>

      <InputField label="السعر" placeholder="0.00 ر.س" />
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
  uploadBox: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    backgroundColor: colors.surface,
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
    color: colors.text,
    fontWeight: '700',
    fontSize: 16,
  },
  uploadSubtitle: {
    color: colors.muted,
    fontSize: 12,
    textAlign: 'center',
  },
  sectionLabel: {
    color: colors.text,
    fontSize: 14,
    textAlign: 'right',
  },
  categoryRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 10,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row-reverse',
    gap: 12,
  },
  flex: {
    flex: 1,
  },
  mapBox: {
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 30,
    alignItems: 'center',
    gap: 8,
  },
  mapText: {
    color: colors.muted,
  },
  ticketRow: {
    flexDirection: 'row-reverse',
    gap: 12,
  },
});
