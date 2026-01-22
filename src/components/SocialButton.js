import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function SocialButton({ label, icon, onPress }) {
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);

  return (
    <Pressable onPress={onPress} style={styles.container}>
      {icon}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const createStyles = (theme, isRTL) =>
  StyleSheet.create({
    container: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 16,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
    },
    label: {
      color: theme.text,
      fontWeight: '600',
      fontSize: 13,
    },
  });
