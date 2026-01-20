import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../styles/colors';

type CategoryPillProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export default function CategoryPill({
  label,
  active = false,
  onPress,
}: CategoryPillProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, active && styles.active]}
    >
      <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
  },
  active: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  activeLabel: {
    color: colors.text,
  },
});
