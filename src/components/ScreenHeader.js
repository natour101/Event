import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function ScreenHeader({ title, subtitle, rightElement }) {
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);

  return (
    <View style={styles.wrapper}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightElement ? <View style={styles.right}>{rightElement}</View> : null}
    </View>
  );
}

const createStyles = (theme, isRTL) =>
  StyleSheet.create({
    wrapper: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      color: theme.text,
      fontSize: 22,
      fontWeight: '700',
      textAlign: isRTL ? 'right' : 'left',
    },
    subtitle: {
      color: theme.muted,
      fontSize: 14,
      marginTop: 4,
      textAlign: isRTL ? 'right' : 'left',
    },
    right: {
      marginLeft: isRTL ? 0 : 12,
      marginRight: isRTL ? 12 : 0,
    },
  });
