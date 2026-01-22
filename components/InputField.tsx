import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { colors } from '../styles/colors';

type InputFieldProps = TextInputProps & {
  label: string;
  leadingIcon?: string;
  trailingIcon?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

export default function InputField({
  label,
  leadingIcon,
  trailingIcon,
  containerStyle,
  inputStyle,
  ...props
}: InputFieldProps) {
  return (
    <View style={containerStyle}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        {leadingIcon ? <Text style={styles.icon}>{leadingIcon}</Text> : null}
        <TextInput
          placeholderTextColor={colors.textDark}
          style={[styles.input, inputStyle]}
          {...props}
        />
        {trailingIcon ? <Text style={styles.icon}>{trailingIcon}</Text> : null}
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
  icon: {
    fontSize: 16,
    color: colors.text,
  },
});
