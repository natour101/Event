import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../styles/colors';

type SocialButtonProps = {
  label: string;
  icon: string;
  onPress?: () => void;
};

export default function SocialButton({ label, icon, onPress }: SocialButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 13,
  },
  icon: {
    fontSize: 18,
  },
});
