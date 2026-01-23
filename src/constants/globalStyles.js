import { StyleSheet } from 'react-native';

export const createGlobalStyles = theme =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.background,
    },
    sectionTitle: {
      color: theme.text,
      fontSize: 20,
      fontWeight: '700',
    },
    sectionSubtitle: {
      color: theme.muted,
      fontSize: 14,
      marginTop: 6,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 18,
      padding: 16,
    },
  });
