import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import { colors } from '../styles/colors';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader title="حسابي" />
      <View style={styles.card}>
        <Text style={styles.name}>سارة عبدالله</Text>
        <Text style={styles.subtitle}>مشرفة فعاليات</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    gap: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
  },
  name: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 6,
  },
});
