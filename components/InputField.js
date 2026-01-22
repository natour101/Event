import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../styles/colors';

export default function InputField({
  label,
  leadingIcon,
  trailingIcon,
  containerStyle,
  inputStyle,
  ...props
}) {
  return (
    <View style={containerStyle}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        {leadingIcon ? <View style={styles.iconSlot}>{leadingIcon}</View> : null}
        <TextInput
          placeholderTextColor={colors.textDark}
          style={[styles.input, inputStyle]}
          {...props}
        />
        {trailingIcon ? <View style={styles.iconSlot}>{trailingIcon}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.text,
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'right',
  },
  inputWrapper: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    color: colors.text,
    textAlign: 'right',
    fontSize: 15,
  },
  iconSlot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
