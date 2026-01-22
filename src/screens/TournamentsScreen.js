import React, { useMemo } from 'react';
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
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { tournamentItems } from '../utils/mockData';

export default function TournamentsScreen() {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader
        title={t('tournaments.title')}
        rightElement={<Icon name="tune-variant" size={18} color={theme.text} />}
      />
      <View style={styles.statusRow}>
        {[
          t('tournaments.statusLive'),
          t('tournaments.statusUpcoming'),
          t('tournaments.statusEnded'),
          t('tournaments.statusMine'),
        ].map((item, index) => (
          <CategoryPill key={item} label={item} active={index === 0} />
        ))}
      </View>

      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>{t('tournaments.trending')}</Text>
        <Icon name="fire" size={18} color={theme.accent} />
      </View>

      <ImageBackground
        source={{ uri: tournamentItems[0].image }}
        style={styles.hero}
        imageStyle={styles.heroImage}
      >
        <View style={styles.liveTag}>
          <Text style={styles.liveText}>{t('tournaments.liveNow')}</Text>
        </View>
      </ImageBackground>
      <View style={styles.heroCard}>
        <View style={styles.heroRow}>
          <View style={styles.gameIcon}>
            <Icon name="gamepad-variant" size={20} color={theme.text} />
          </View>
          <View style={styles.heroInfo}>
            <Text style={styles.heroTitle}>{tournamentItems[0].title}</Text>
            <Text style={styles.heroSubtitle}>{tournamentItems[0].subtitle}</Text>
            <Text style={styles.heroMeta}>
              {tournamentItems[0].prize} • {tournamentItems[0].teams}
            </Text>
          </View>
        </View>
        <PrimaryButton label={t('tournaments.watch')} />
      </View>

      <Text style={styles.sectionTitle}>{t('tournaments.champions')}</Text>
      <View style={styles.badgeRow}>
        {['Rocket League', 'CoD', 'FIFA'].map(item => (
          <View key={item} style={styles.badge}>
            <Text style={styles.badgeText}>{item}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>{t('tournaments.upcoming')}</Text>
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
              <Text style={styles.listMeta}>
                {t('tournaments.prize')}: {item.prize}
              </Text>
              <PrimaryButton label={t('tournaments.registerTeam')} variant="secondary" />
            </View>
          </View>
        ))}
      </View>
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
    statusRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      gap: 10,
      flexWrap: 'wrap',
    },
    sectionTitleRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 8,
    },
    sectionTitle: {
      color: theme.text,
      fontSize: 18,
      fontWeight: '700',
      textAlign: isRTL ? 'right' : 'left',
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
      color: theme.text,
      fontSize: 12,
      fontWeight: '700',
    },
    heroCard: {
      backgroundColor: theme.surface,
      borderRadius: 18,
      padding: 16,
      gap: 16,
    },
    heroRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 12,
    },
    gameIcon: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: theme.surfaceLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroInfo: {
      flex: 1,
    },
    heroTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '700',
      textAlign: isRTL ? 'right' : 'left',
    },
    heroSubtitle: {
      color: theme.muted,
      fontSize: 12,
      marginTop: 4,
      textAlign: isRTL ? 'right' : 'left',
    },
    heroMeta: {
      color: theme.accent,
      fontSize: 12,
      marginTop: 8,
      textAlign: isRTL ? 'right' : 'left',
    },
    badgeRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      gap: 12,
    },
    badge: {
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.border,
      paddingVertical: 10,
      paddingHorizontal: 16,
      backgroundColor: theme.surface,
    },
    badgeText: {
      color: theme.text,
      fontSize: 12,
      fontWeight: '600',
    },
    list: {
      gap: 14,
    },
    listCard: {
      backgroundColor: theme.surface,
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
      color: theme.text,
      fontSize: 15,
      fontWeight: '700',
      textAlign: isRTL ? 'right' : 'left',
    },
    listSubtitle: {
      color: theme.textDark,
      fontSize: 12,
      textAlign: isRTL ? 'right' : 'left',
    },
    listMeta: {
      color: theme.accent,
      fontSize: 12,
      textAlign: isRTL ? 'right' : 'left',
    },
  });
