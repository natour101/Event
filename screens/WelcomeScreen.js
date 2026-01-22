import React from 'react';
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import Icon from '../components/Icon';
import { colors } from '../styles/colors';

export default function WelcomeScreen() {
  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=1200&q=80',
      }}
      style={styles.background}
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <View style={styles.logo}>
            <Icon name="ticket-confirmation" size={30} color={colors.text} />
          </View>
          <Text style={styles.title}>عالم الفعاليات بين يديك</Text>
          <Text style={styles.subtitle}>
            خطط لمناسبتك القادمة أو اكتشف أروع الفعاليات والحفلات حولك بكل
            سهولة.
          </Text>
        </View>
        <View style={styles.actions}>
          <PrimaryButton label="إنشاء حساب جديد" />
          <PrimaryButton label="تسجيل الدخول" variant="secondary" />
          <View style={styles.languageRow}>
            <Icon name="earth" size={16} color={colors.muted} />
            <Text style={styles.languageText}>English</Text>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 12, 8, 0.65)',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  centerContent: {
    marginTop: 90,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: colors.textDark,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    gap: 14,
  },
  languageRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  languageText: {
    color: colors.muted,
    fontSize: 14,
  },
});
