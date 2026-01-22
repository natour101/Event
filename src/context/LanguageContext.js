import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules, Platform } from 'react-native';
import ar from '../locales/ar';
import en from '../locales/en';
import { LANGUAGE, STORAGE_KEYS } from '../constants/strings';

const defaultLanguageState = {
  language: LANGUAGE.ar,
  isRTL: true,
  t: key => key,
  toggleLanguage: () => {},
  loadLanguage: () => {},
};

const LanguageContext = createContext(defaultLanguageState);

const translations = {
  [LANGUAGE.ar]: ar,
  [LANGUAGE.en]: en,
};

const getDeviceLanguage = () => {
  if (Platform.OS === 'ios') {
    const settings = NativeModules.SettingsManager?.settings;
    const locale =
      settings?.AppleLocale || (settings?.AppleLanguages || [])[0] || '';
    return locale;
  }
  const locale = NativeModules.I18nManager?.localeIdentifier || '';
  return locale;
};

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, key) => (acc ? acc[key] : null), obj);
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(LANGUAGE.ar);

  const isRTL = language === LANGUAGE.ar;

  const t = useCallback(
    key => {
      const primary = getNestedValue(translations[language], key);
      if (primary) return primary;
      const fallback = getNestedValue(translations[LANGUAGE.ar], key);
      return fallback || '';
    },
    [language]
  );

  const toggleLanguage = useCallback(async () => {
    const next = language === LANGUAGE.ar ? LANGUAGE.en : LANGUAGE.ar;
    setLanguage(next);
    await AsyncStorage.setItem(STORAGE_KEYS.language, next);
  }, [language]);

  const loadLanguage = useCallback(async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.language);
    if (stored) {
      setLanguage(stored);
      return;
    }
    const deviceLanguage = getDeviceLanguage();
    if (deviceLanguage?.toLowerCase().startsWith('en')) {
      setLanguage(LANGUAGE.en);
    } else {
      setLanguage(LANGUAGE.ar);
    }
  }, []);

  useEffect(() => {
    loadLanguage();
  }, [loadLanguage]);

  const value = useMemo(
    () => ({ language, isRTL, t, toggleLanguage, loadLanguage }),
    [language, isRTL, t, toggleLanguage, loadLanguage]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext) || defaultLanguageState;
}
