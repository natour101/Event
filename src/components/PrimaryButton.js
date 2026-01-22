import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function PrimaryButton({
  label,
  onPress,
  style,
  variant = 'primary',
  icon,
  iconComponent,
}) {
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);
  const variantStyle = styles.variants[variant] || styles.variants.primary;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, variantStyle.container, style]}
    >
      {iconComponent || (icon ? <Text style={styles.icon}>{icon}</Text> : null)}
      <Text style={[styles.label, variantStyle.label]}>{label}</Text>
    </Pressable>
  );
}

const createStyles = (theme, isRTL) =>
  StyleSheet.create({
    container: {
      borderRadius: 18,
      paddingVertical: 14,
      paddingHorizontal: 20,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: isRTL ? 'row-reverse' : 'row',
      gap: 10,
      borderWidth: 1,
    },
    label: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.text,
    },
    icon: {
      fontSize: 18,
      color: theme.text,
    },
    variants: {
      primary: {
        container: {
          backgroundColor: theme.accent,
          borderColor: theme.accent,
        },
        label: {
          color: theme.text,
        },
      },
      secondary: {
        container: {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
        label: {
          color: theme.text,
        },
      },
      outline: {
        container: {
          backgroundColor: 'transparent',
          borderColor: theme.border,
        },
        label: {
          color: theme.text,
        },
      },
    },
  });
