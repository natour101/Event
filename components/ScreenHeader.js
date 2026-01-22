import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/colors';

export default function ScreenHeader({ title, subtitle, rightElement }) {
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

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'right',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 4,
    textAlign: 'right',
  },
  right: {
    marginLeft: 12,
  },
});
