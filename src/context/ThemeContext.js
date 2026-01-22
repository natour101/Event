import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buildTheme } from '../constants/theme';
import { STORAGE_KEYS } from '../constants/strings';

const defaultThemeState = {
  mode: 'dark',
  theme: buildTheme('dark'),
  toggleMode: () => {},
  loadTheme: () => {},
};

const ThemeContext = createContext(defaultThemeState);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('dark');

  const theme = useMemo(() => buildTheme(mode), [mode]);

  const toggleMode = useCallback(async () => {
    const next = mode === 'dark' ? 'softDark' : 'dark';
    setMode(next);
    await AsyncStorage.setItem(STORAGE_KEYS.theme, next);
  }, [mode]);

  const loadTheme = useCallback(async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.theme);
    if (stored) {
      setMode(stored);
    }
  }, []);

  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  const value = useMemo(
    () => ({ mode, theme, toggleMode, loadTheme }),
    [mode, theme, toggleMode, loadTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext) || defaultThemeState;
}
