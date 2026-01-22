import React from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from '../components/Icon';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import { colors } from '../styles/colors';
import { detailData } from '../utils/mockData';

export default function EventDetailsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
        }}
        style={styles.hero}
        imageStyle={styles.heroImage}
      >
        <View style={styles.heroActions}>
          <View style={styles.iconButton}>
            <Icon name="share-variant" size={16} color={colors.text} />
          </View>
          <View style={styles.iconButton}>
            <Icon name="heart-outline" size={16} color={colors.text} />
          </View>
        </View>
      </ImageBackground>

      <ScreenHeader
        title={detailData.title}
        rightElement={<Icon name="ticket-confirmation" size={18} color={colors.text} />}
      />
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>{detailData.attendees}</Text>
        <Text style={styles.metaText}>⭐ {detailData.rating}</Text>
      </View>

      <View style={styles.hostRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>م</Text>
        </View>
        <View style={styles.hostInfo}>
          <Text style={styles.hostLabel}>المنظم</Text>
          <Text style={styles.hostName}>{detailData.host}</Text>
        </View>
        <PrimaryButton label="متابعة" variant="secondary" />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>الوقت والتاريخ</Text>
        <Text style={styles.cardValue}>{detailData.date}</Text>
        <Text style={styles.cardValue}>{detailData.time}</Text>
        <Text style={styles.cardLink}>+ إضافة إلى التقويم</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>الموقع</Text>
        <Text style={styles.cardValue}>{detailData.location}</Text>
        <View style={styles.mapPreview}>
          <Icon name="map-outline" size={18} color="#2f1c14" />
          <Text style={styles.mapText}>فتح الخريطة</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>عن الحدث</Text>
        <Text style={styles.cardValue}>{detailData.description}</Text>
        <Text style={styles.cardLink}>اقرأ المزيد</Text>
      </View>

      <PrimaryButton
        label="سجل الآن"
        iconComponent={<Icon name="arrow-left" size={18} color={colors.text} />}
      />
      <Text style={styles.priceText}>مجانا</Text>
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
  hero: {
    height: 220,
    borderRadius: 22,
    overflow: 'hidden',
  },
  heroImage: {
    borderRadius: 22,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 12,
    alignSelf: 'flex-end',
    padding: 16,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row-reverse',
    gap: 12,
  },
  metaText: {
    color: colors.muted,
    fontSize: 12,
  },
  hostRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.text,
    fontWeight: '700',
  },
  hostInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  hostLabel: {
    color: colors.muted,
    fontSize: 12,
  },
  hostName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    gap: 8,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'right',
  },
  cardValue: {
    color: colors.textDark,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'right',
  },
  cardLink: {
    color: colors.accent,
    fontSize: 12,
    textAlign: 'right',
  },
  mapPreview: {
    height: 110,
    borderRadius: 14,
    backgroundColor: '#f0e6da',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  mapText: {
    color: '#2f1c14',
    fontWeight: '600',
  },
  priceText: {
    color: colors.text,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 20,
  },
});
