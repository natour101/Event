import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../styles/colors';

const variantStyles = {
  primary: {
    container: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    label: {
      color: colors.text,
    },
  },
  secondary: {
    container: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    label: {
      color: colors.text,
    },
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderColor: colors.border,
    },
    label: {
      color: colors.text,
    },
  },
};

export default function PrimaryButton({
  label,
  onPress,
  style,
  variant = 'primary',
  icon,
  iconComponent,
}) {
  const variantStyle = variantStyles[variant] || variantStyles.primary;

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

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row-reverse',
    gap: 10,
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
  icon: {
    fontSize: 18,
    color: colors.text,
  },
});
