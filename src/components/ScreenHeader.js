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
      <View style={styles.textBlock}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={2} ellipsizeMode="tail">
            {subtitle}
          </Text>
        ) : null}
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
    textBlock: {
      flex: 1,
      flexShrink: 1,
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
      flexShrink: 1,
    },
    right: {
      marginLeft: isRTL ? 0 : 12,
      marginRight: isRTL ? 12 : 0,
    },
  });
