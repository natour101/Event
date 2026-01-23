import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function SectionHeader({ title, action, onActionPress }) {
  const { theme } = useTheme();
  const { isRTL } = useLanguage();
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);

  return (
    <View style={styles.wrapper}>
      {action ? (
        <Pressable onPress={onActionPress} disabled={!onActionPress}>
          <Text style={styles.action} numberOfLines={1} ellipsizeMode="tail">
            {action}
          </Text>
        </Pressable>
      ) : null}
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </Text>
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
      flexShrink: 1,
    },
    action: {
      color: theme.accent,
      fontSize: 13,
      fontWeight: '600',
      flexShrink: 1,
    },
  });
