import React from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CategoryPill from '../components/CategoryPill';
import Icon from '../components/Icon';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import { colors } from '../styles/colors';
import { tournamentItems } from '../utils/mockData';

export default function TournamentsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader
        title="البطولات"
        rightElement={<Icon name="tune-variant" size={18} color={colors.text} />}
      />
      <View style={styles.statusRow}>
        {['مباشر', 'قادم', 'انتهت', 'بطولاتي'].map((item, index) => (
          <CategoryPill key={item} label={item} active={index === 0} />
        ))}
      </View>

      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>الأكثر رواجاً</Text>
        <Icon name="fire" size={18} color={colors.accent} />
      </View>

      <ImageBackground
        source={{ uri: tournamentItems[0].image }}
        style={styles.hero}
        imageStyle={styles.heroImage}
      >
        <View style={styles.liveTag}>
          <Text style={styles.liveText}>مباشر الآن</Text>
        </View>
      </ImageBackground>
      <View style={styles.heroCard}>
        <View style={styles.heroRow}>
          <View style={styles.gameIcon}>
            <Icon name="gamepad-variant" size={20} color={colors.text} />
          </View>
          <View style={styles.heroInfo}>
            <Text style={styles.heroTitle}>{tournamentItems[0].title}</Text>
            <Text style={styles.heroSubtitle}>{tournamentItems[0].subtitle}</Text>
            <Text style={styles.heroMeta}>
              {tournamentItems[0].prize} • {tournamentItems[0].teams}
            </Text>
          </View>
        </View>
        <PrimaryButton label="شاهد البث" />
      </View>

      <Text style={styles.sectionTitle}>أبطال الموسم السابق</Text>
      <View style={styles.badgeRow}>
        {['Rocket League', 'CoD', 'FIFA'].map(item => (
          <View key={item} style={styles.badge}>
            <Text style={styles.badgeText}>{item}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>بطولات قادمة</Text>
      <View style={styles.list}>
        {tournamentItems.map(item => (
          <View key={item.id} style={styles.listCard}>
            <ImageBackground
              source={{ uri: item.image }}
              style={styles.listImage}
              imageStyle={styles.listImageRadius}
            />
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>{item.title}</Text>
              <Text style={styles.listSubtitle}>{item.subtitle}</Text>
              <Text style={styles.listMeta}>الجائزة: {item.prize}</Text>
              <PrimaryButton label="سجل فريقك" variant="secondary" />
            </View>
          </View>
        ))}
      </View>
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
  statusRow: {
    flexDirection: 'row-reverse',
    gap: 10,
    flexWrap: 'wrap',
  },
  sectionTitleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  hero: {
    height: 160,
    borderRadius: 18,
    overflow: 'hidden',
  },
  heroImage: {
    borderRadius: 18,
  },
  liveTag: {
    alignSelf: 'flex-end',
    backgroundColor: '#c53030',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    margin: 12,
  },
  liveText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    gap: 16,
  },
  heroRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  gameIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroInfo: {
    flex: 1,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'right',
  },
  heroSubtitle: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  heroMeta: {
    color: colors.accent,
    fontSize: 12,
    marginTop: 8,
    textAlign: 'right',
  },
  badgeRow: {
    flexDirection: 'row-reverse',
    gap: 12,
  },
  badge: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
  },
  badgeText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  list: {
    gap: 14,
  },
  listCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    overflow: 'hidden',
  },
  listImage: {
    height: 120,
  },
  listImageRadius: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  listContent: {
    padding: 14,
    gap: 8,
  },
  listTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'right',
  },
  listSubtitle: {
    color: colors.textDark,
    fontSize: 12,
    textAlign: 'right',
  },
  listMeta: {
    color: colors.accent,
    fontSize: 12,
    textAlign: 'right',
  },
});
