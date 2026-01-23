import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import Icon from '../components/Icon';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import ScreenHeader from '../components/ScreenHeader';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { profileApi } from '../services/api';

const validateEmail = value => /\S+@\S+\.\S+/.test(value);

export default function ProfileScreen() {
  const { t, isRTL } = useLanguage();
  const { theme, mode, toggleMode } = useTheme();
  const { user, logout, updateUser } = useAuth();
  const styles = useMemo(() => createStyles(theme, isRTL), [theme, isRTL]);
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    phone_number: '',
    profile_image_url: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    password: '',
    passwordConfirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const hydrateForm = useCallback(profile => {
    setForm({
      name: profile?.name || '',
      username: profile?.username || '',
      email: profile?.email || '',
      phone_number: profile?.phone_number || '',
      profile_image_url: profile?.profile_image_url || '',
    });
  }, []);

  const fetchProfile = useCallback(async () => {
    setStatus(prev => ({ ...prev, loading: true, error: '', success: '' }));
    try {
      const response = await profileApi.show();
      const nextUser = response.data?.user;
      if (nextUser) {
        updateUser(nextUser);
        hydrateForm(nextUser);
      }
    } catch (fetchError) {
      setStatus(prev => ({ ...prev, error: fetchError?.message || t('common.error') }));
    } finally {
      setStatus(prev => ({ ...prev, loading: false }));
    }
  }, [hydrateForm, t, updateUser]);

  useEffect(() => {
    if (user) {
      hydrateForm(user);
    }
  }, [user, hydrateForm]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const validateProfile = () => {
    const nextErrors = {};
    if (!form.name) nextErrors.name = t('auth.errors.required');
    if (form.email && !validateEmail(form.email)) {
      nextErrors.email = t('auth.errors.email');
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSaveProfile = async () => {
    if (!validateProfile()) return;
    setStatus({ loading: true, error: '', success: '' });
    try {
      const response = await profileApi.update(form);
      const nextUser = response.data?.user;
      if (nextUser) {
        updateUser(nextUser);
        hydrateForm(nextUser);
      }
      setStatus({ loading: false, error: '', success: t('profile.updated') });
    } catch (error) {
      setStatus({ loading: false, error: error?.message || t('common.error'), success: '' });
    }
  };

  const onChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.password) {
      setStatus({ loading: false, error: t('auth.errors.required'), success: '' });
      return;
    }
    setStatus({ loading: true, error: '', success: '' });
    try {
      await profileApi.updatePassword({
        current_password: passwordForm.currentPassword,
        password: passwordForm.password,
        password_confirmation: passwordForm.passwordConfirmation,
      });
      setPasswordForm({ currentPassword: '', password: '', passwordConfirmation: '' });
      setStatus({ loading: false, error: '', success: t('profile.passwordUpdated') });
    } catch (error) {
      setStatus({ loading: false, error: error?.message || t('common.error'), success: '' });
    }
  };

  const onUploadAvatar = async () => {
    if (!form.profile_image_url) return;
    setStatus({ loading: true, error: '', success: '' });
    try {
      const response = await profileApi.update({
        profile_image_url: form.profile_image_url,
      });
      const nextUser = response.data?.user;
      if (nextUser) {
        updateUser(nextUser);
      }
      setStatus({ loading: false, error: '', success: t('profile.avatarUpdated') });
    } catch (error) {
      setStatus({ loading: false, error: error?.message || t('common.error'), success: '' });
    }
  };

  const userName = user?.name || t('profile.name');
  const userEmail = user?.email || 'user@email.com';
  const userPhone = user?.phone_number || user?.phone || '+966 5x xxx xxxx';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader title={t('profile.title')} />
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          {user?.profile_image_url ? (
            <Image source={{ uri: user.profile_image_url }} style={styles.avatarImage} />
          ) : (
            <Icon name="account" size={36} color={theme.text} />
          )}
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {userName}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
            {userEmail}
          </Text>
          <Text style={styles.meta} numberOfLines={1} ellipsizeMode="tail">
            {userPhone}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('profile.accountSettings')}</Text>
        <View style={styles.card}>
          <InputField
            label={t('profile.nameLabel')}
            value={form.name}
            onChangeText={value => onChange('name', value)}
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          <InputField
            label={t('profile.username')}
            value={form.username}
            onChangeText={value => onChange('username', value)}
          />
          <InputField
            label={t('profile.email')}
            value={form.email}
            onChangeText={value => onChange('email', value)}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          <InputField
            label={t('profile.phone')}
            value={form.phone_number}
            onChangeText={value => onChange('phone_number', value)}
            keyboardType="phone-pad"
          />
          <PrimaryButton
            label={status.loading ? t('common.loading') : t('common.save')}
            onPress={onSaveProfile}
            style={status.loading ? styles.disabledButton : null}
          />
          {status.error ? <Text style={styles.errorText}>{status.error}</Text> : null}
          {status.success ? <Text style={styles.successText}>{status.success}</Text> : null}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('profile.avatar')}</Text>
        <View style={styles.card}>
          <InputField
            label={t('profile.avatarUrl')}
            value={form.profile_image_url}
            onChangeText={value => onChange('profile_image_url', value)}
            placeholder="https://"
          />
          <PrimaryButton
            label={t('profile.uploadAvatar')}
            onPress={onUploadAvatar}
            style={status.loading ? styles.disabledButton : null}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('profile.password')}</Text>
        <View style={styles.card}>
          <InputField
            label={t('profile.currentPassword')}
            secureTextEntry
            value={passwordForm.currentPassword}
            onChangeText={value =>
              setPasswordForm(prev => ({ ...prev, currentPassword: value }))
            }
          />
          <InputField
            label={t('profile.newPassword')}
            secureTextEntry
            value={passwordForm.password}
            onChangeText={value => setPasswordForm(prev => ({ ...prev, password: value }))}
          />
          <InputField
            label={t('profile.confirmPassword')}
            secureTextEntry
            value={passwordForm.passwordConfirmation}
            onChangeText={value =>
              setPasswordForm(prev => ({ ...prev, passwordConfirmation: value }))
            }
          />
          <PrimaryButton
            label={t('profile.updatePassword')}
            variant="secondary"
            onPress={onChangePassword}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('profile.theme')}</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>{t('profile.themeToggle')}</Text>
            <Switch
              value={mode === 'softDark'}
              onValueChange={toggleMode}
              trackColor={{ true: theme.accent, false: theme.border }}
              thumbColor={theme.text}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('profile.language')}</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>{t('common.language')}</Text>
            <Text style={styles.value}>
              {t('common.arabic')} / {t('common.english')}
            </Text>
          </View>
        </View>
      </View>

      <PrimaryButton label={t('profile.logout')} variant="secondary" onPress={logout} />
    </ScrollView>
  );
}

const createStyles = (theme, isRTL) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      padding: 20,
      gap: 16,
      paddingBottom: 32,
    },
    profileHeader: {
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: 16,
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 16,
    },
    avatar: {
      width: 70,
      height: 70,
      borderRadius: 24,
      backgroundColor: theme.surfaceLight,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
    },
    profileInfo: {
      flex: 1,
      alignItems: isRTL ? 'flex-end' : 'flex-start',
    },
    name: {
      color: theme.text,
      fontSize: 20,
      fontWeight: '700',
    },
    subtitle: {
      color: theme.muted,
      fontSize: 13,
      marginTop: 4,
      flexShrink: 1,
    },
    meta: {
      color: theme.textDark,
      fontSize: 12,
      marginTop: 4,
      flexShrink: 1,
    },
    section: {
      gap: 12,
    },
    sectionTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '700',
      textAlign: isRTL ? 'right' : 'left',
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 18,
      padding: 16,
      gap: 12,
    },
    row: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    label: {
      color: theme.text,
      fontSize: 14,
      fontWeight: '600',
      flexShrink: 1,
    },
    value: {
      color: theme.textDark,
      fontSize: 13,
      flexShrink: 1,
    },
    errorText: {
      color: theme.warning,
      fontSize: 12,
      textAlign: isRTL ? 'right' : 'left',
    },
    successText: {
      color: theme.accent,
      fontSize: 12,
      textAlign: isRTL ? 'right' : 'left',
    },
    disabledButton: {
      opacity: 0.7,
    },
  });
