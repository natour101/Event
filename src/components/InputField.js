import React, { useMemo } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function InputField({
  label,
  leadingIcon,
  trailingIcon,
  containerStyle,
  inputStyle,
  ...props
}) {
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);

  return (
    <View style={containerStyle}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        {leadingIcon ? <View style={styles.iconSlot}>{leadingIcon}</View> : null}
        <TextInput
          placeholderTextColor={theme.textDark}
          style={[styles.input, inputStyle]}
          {...props}
        />
        {trailingIcon ? <View style={styles.iconSlot}>{trailingIcon}</View> : null}
      </View>
    </View>
  );
}

const createStyles = (theme, isRTL) =>
  StyleSheet.create({
    label: {
      color: theme.text,
      fontSize: 14,
      marginBottom: 8,
      textAlign: isRTL ? 'right' : 'left',
    },
    inputWrapper: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 10,
    },
    input: {
      flex: 1,
      color: theme.text,
      textAlign: isRTL ? 'right' : 'left',
      fontSize: 15,
    },
    iconSlot: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
