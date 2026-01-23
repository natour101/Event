import React, { useMemo, useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CategoryPill from '../components/CategoryPill';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import SocialButton from '../components/SocialButton';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const validateEmail = value => /\S+@\S+\.\S+/.test(value);
const validatePhone = value => /^[0-9+\-()\s]{7,}$/.test(value);

export default function AuthScreen({ navigation, route }) {
  const { t, isRTL } = useLanguage();
  const { theme } = useTheme();
  const { login, register } = useAuth();
  const [mode, setMode] = useState(route?.params?.mode || 'login');
  const [form, setForm] = useState({
    email: '',
    password: '',
    username: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);

  const onChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.email) nextErrors.email = t('auth.errors.required');
    if (form.email && !validateEmail(form.email)) {
      nextErrors.email = t('auth.errors.email');
    }
    if (!form.password) nextErrors.password = t('auth.errors.required');
    if (form.password && form.password.length < 6) {
      nextErrors.password = t('auth.errors.password');
    }
    if (mode === 'register') {
      if (!form.username) nextErrors.username = t('auth.errors.required');
      if (!form.phone) nextErrors.phone = t('auth.errors.required');
      if (form.phone && !validatePhone(form.phone)) {
        nextErrors.phone = t('auth.errors.phone');
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setSubmitError('');
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password });
      } else {
        await register({
          email: form.email,
          password: form.password,
          username: form.username,
          phone_number: form.phone,
        });
      }
      navigation.replace('Main');
    } catch (error) {
      const response = error?.response || {};
      setSubmitError(
        response?.message ||
          response?.error ||
          error?.message ||
          'Request failed'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80',
      }}
      style={styles.background}
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboard}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View>
              <View style={styles.logoRow}>
                <View style={styles.logo}>
                  <Icon name="ticket-confirmation" size={24} color={theme.text} />
                </View>
                <View style={styles.headerText}>
                  <Text style={styles.title} numberOfLines={1}>
                    {t('auth.title')}
                  </Text>
                  <Text style={styles.subtitle} numberOfLines={2}>
                    {t('auth.subtitle')}
                  </Text>
                </View>
              </View>

              <View style={styles.segmented}>
                <CategoryPill
                  label={t('common.login')}
                  active={mode === 'login'}
                  onPress={() => setMode('login')}
                />
                <CategoryPill
                  label={t('common.register')}
                  active={mode === 'register'}
                  onPress={() => setMode('register')}
                />
              </View>

              <View style={styles.form}>
                {mode === 'register' ? (
                  <>
                    <InputField
                      label={t('auth.username')}
                      placeholder={t('auth.usernamePlaceholder')}
                      value={form.username}
                      onChangeText={value => onChange('username', value)}
                      leadingIcon={
                        <Icon name="account-outline" size={18} color={theme.text} />
                      }
                    />
                    {errors.username ? (
                      <Text style={styles.errorText}>{errors.username}</Text>
                    ) : null}
                    <InputField
                      label={t('auth.phone')}
                      placeholder={t('auth.phonePlaceholder')}
                      value={form.phone}
                      onChangeText={value => onChange('phone', value)}
                      keyboardType="phone-pad"
                      leadingIcon={
                        <Icon name="phone-outline" size={18} color={theme.text} />
                      }
                    />
                    {errors.phone ? (
                      <Text style={styles.errorText}>{errors.phone}</Text>
                    ) : null}
                  </>
                ) : null}
                <InputField
                  label={t('auth.email')}
                  placeholder={t('auth.emailPlaceholder')}
                  value={form.email}
                  onChangeText={value => onChange('email', value)}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  leadingIcon={<Icon name="email-outline" size={18} color={theme.text} />}
                />
                {errors.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}
                <InputField
                  label={t('auth.password')}
                  placeholder={t('auth.passwordPlaceholder')}
                  secureTextEntry
                  value={form.password}
                  onChangeText={value => onChange('password', value)}
                  leadingIcon={<Icon name="eye-outline" size={18} color={theme.text} />}
                  trailingIcon={<Icon name="emoticon-outline" size={18} color={theme.text} />}
                />
                {errors.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}
                {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}
                {mode === 'login' ? (
                  <Text style={styles.link}>{t('auth.forgot')}</Text>
                ) : null}
                <PrimaryButton
                  label={mode === 'login' ? t('common.login') : t('common.register')}
                  iconComponent={<Icon name="arrow-left" size={18} color={theme.text} />}
                  onPress={onSubmit}
                  style={submitting ? styles.disabledButton : null}
                />
              </View>
            </View>

            <View>
              <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>{t('auth.orContinue')}</Text>
                <View style={styles.divider} />
              </View>
              <View style={styles.socialRow}>
                <SocialButton
                  label="Apple"
                  icon={<Icon family="fa5" name="apple" size={16} color={theme.text} />}
                />
                <SocialButton
                  label="Google"
                  icon={<Icon family="fa5" name="google" size={16} color={theme.text} />}
                />
                <SocialButton
                  label="X"
                  icon={<Icon family="fa5" name="x-twitter" size={16} color={theme.text} />}
                />
              </View>
              <Text style={styles.terms}>{t('auth.terms')}</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const createStyles = (theme, isRTL) =>
  StyleSheet.create({
    background: {
      flex: 1,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(17, 10, 7, 0.72)',
    },
    container: {
      flex: 1,
      justifyContent: 'space-between',
      padding: 24,
    },
    keyboard: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'space-between',
      gap: 20,
      paddingBottom: 20,
    },
    logoRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 16,
      marginTop: 12,
    },
    headerText: {
      flex: 1,
      flexShrink: 1,
    },
    logo: {
      width: 56,
      height: 56,
      borderRadius: 18,
      backgroundColor: theme.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      color: theme.text,
      fontSize: 22,
      fontWeight: '700',
      textAlign: isRTL ? 'right' : 'left',
    },
    subtitle: {
      color: theme.textDark,
      fontSize: 13,
      marginTop: 6,
      textAlign: isRTL ? 'right' : 'left',
      flexShrink: 1,
    },
    segmented: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      gap: 12,
      marginTop: 20,
    },
    form: {
      marginTop: 20,
      gap: 16,
    },
    link: {
      color: theme.accent,
      fontSize: 13,
      fontWeight: '600',
      textAlign: isRTL ? 'right' : 'left',
    },
    dividerRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 16,
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: theme.border,
    },
    dividerText: {
      color: theme.muted,
      fontSize: 12,
    },
    socialRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      gap: 10,
    },
    terms: {
      color: theme.muted,
      fontSize: 11,
      textAlign: 'center',
      marginTop: 16,
      lineHeight: 16,
    },
    errorText: {
      color: theme.warning,
      fontSize: 12,
      textAlign: isRTL ? 'right' : 'left',
    },
    disabledButton: {
      opacity: 0.7,
    },
  });
