import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/colors';

type SectionHeaderProps = {
  title: string;
  action?: string;
};

export default function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <View style={styles.wrapper}>
      {action ? <Text style={styles.action}>{action}</Text> : null}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  action: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },
});
