import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function CategoryPill({ label, active = false, onPress }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, active && styles.active]}
    >
      <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
    </Pressable>
  );
}

const createStyles = theme =>
  StyleSheet.create({
    container: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 18,
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderWidth: 1,
    },
    active: {
      backgroundColor: theme.accent,
      borderColor: theme.accent,
    },
    label: {
      color: theme.text,
      fontSize: 13,
      fontWeight: '600',
    },
    activeLabel: {
      color: theme.text,
    },
  });
