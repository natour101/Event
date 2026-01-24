import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function InputField({
  label,
  leadingIcon,
  trailingIcon,
  containerStyle,
  inputStyle,
  onPress,
  onPressIn,
  editable = true,
  ...props
}) {
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);
  const isPressable = Boolean(onPress || onPressIn);
  const Wrapper = isPressable ? Pressable : View;
  const inputEditable = isPressable ? false : editable;

  return (
    <View style={containerStyle}>
      <Text style={styles.label}>{label}</Text>
      <Wrapper style={styles.inputWrapper} onPress={onPress} onPressIn={onPressIn}>
        {leadingIcon ? <View style={styles.iconSlot}>{leadingIcon}</View> : null}
        <TextInput
          placeholderTextColor={theme.textDark}
          style={[styles.input, inputStyle]}
          editable={inputEditable}
          pointerEvents={isPressable ? 'none' : 'auto'}
          onPressIn={isPressable ? undefined : onPressIn}
          {...props}
        />
        {trailingIcon ? <View style={styles.iconSlot}>{trailingIcon}</View> : null}
      </Wrapper>
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
