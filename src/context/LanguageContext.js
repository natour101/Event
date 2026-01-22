import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ar from '../locales/ar';
import en from '../locales/en';
import { LANGUAGE, STORAGE_KEYS } from '../constants/strings';

const LanguageContext = createContext(null);

const translations = {
  [LANGUAGE.ar]: ar,
  [LANGUAGE.en]: en,
};

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, key) => (acc ? acc[key] : null), obj);
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(LANGUAGE.ar);

  const isRTL = language === LANGUAGE.ar;

  const t = useCallback(
    key => {
      const value = getNestedValue(translations[language], key);
      return value || key;
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
  return useContext(LanguageContext);
}
