import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function SectionHeader({ title, action }) {
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);

  return (
    <View style={styles.wrapper}>
      {action ? <Text style={styles.action}>{action}</Text> : null}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const createStyles = (theme, isRTL) =>
  StyleSheet.create({
    wrapper: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      color: theme.text,
      fontSize: 18,
      fontWeight: '700',
    },
    action: {
      color: theme.accent,
      fontSize: 13,
      fontWeight: '600',
    },
  });
