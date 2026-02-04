import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from '../components/Icon';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import ScreenHeader from '../components/ScreenHeader';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { profileApi } from '../services/api';
import { unwrapResource } from '../utils/api';
import { resolveMediaUrl } from '../utils/media';

const validateEmail = value => /\S+@\S+\.\S+/.test(value);

const COVER_URL =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80';

export default function ProfileScreen() {
  const { t, isRTL, toggleLanguage } = useLanguage();
  const { theme, mode, toggleMode } = useTheme();
  const { user, token, logout, updateUser } = useAuth();
  const navigation = useNavigation();
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

  useEffect(() => {
    if (user) hydrateForm(user);
  }, [user, hydrateForm]);

  const goToWelcome = () => {
    const rootNavigation = navigation.getParent();
    if (rootNavigation) rootNavigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
    else navigation.navigate('Welcome');
  };

  const onChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const validateProfile = () => {
    const nextErrors = {};
    if (!form.name) nextErrors.name = t('auth.errors.required');
    if (form.email && !validateEmail(form.email)) nextErrors.email = t('auth.errors.email');
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSaveProfile = async () => {
    if (!validateProfile()) return;
    setStatus({ loading: true, error: '', success: '' });
    try {
      const response = await profileApi.update(form);
      const nextUser = unwrapResource(response.data?.user);
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

  const onPickAvatar = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });
    const asset = result?.assets?.[0];
    if (!asset?.uri) return;

    setStatus({ loading: true, error: '', success: '' });
    try {
      const payload = new FormData();
      payload.append('avatar', {
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || `avatar-${Date.now()}.jpg`,
      });

      const response = await profileApi.uploadAvatar(payload);
      const nextUser = unwrapResource(response.data?.user);
      if (nextUser) {
        updateUser(nextUser);
        hydrateForm(nextUser);
      }
      setStatus({ loading: false, error: '', success: t('profile.avatarUpdated') });
    } catch (error) {
      setStatus({ loading: false, error: error?.message || t('common.error'), success: '' });
    }
  };

  const onResetProfile = () => {
    hydrateForm(user);
    setPasswordForm({ currentPassword: '', password: '', passwordConfirmation: '' });
    setErrors({});
    setStatus({ loading: false, error: '', success: '' });
  };

  const userName = user?.name || t('profile.noData');
  const userEmail = user?.email || t('profile.noData');
  const userPhone = user?.phone_number || user?.phone || t('profile.noData');
  const avatarUri = resolveMediaUrl(form.profile_image_url || user?.profile_image_url);

  if (!user && !token) {
    return (
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=1200&q=80',
        }}
        style={styles.guestBackground}
        blurRadius={12}
      >
        <View style={styles.guestOverlay} />
        <View style={styles.guestContent}>
          <View style={styles.guestCard}>
            <View style={styles.guestIcon}>
              <Icon name="account-circle-outline" size={38} color={theme.text} />
            </View>
            <Text style={styles.guestTitle}>{t('profile.guestTitle')}</Text>
            <Text style={styles.guestSubtitle}>{t('profile.guestSubtitle')}</Text>
            <PrimaryButton label={t('common.login')} onPress={goToWelcome} />
          </View>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader title={t('profile.title')} />

      {/* Cover */}
      <View style={styles.coverWrap}>
        <ImageBackground source={{ uri: COVER_URL }} style={styles.cover} resizeMode="cover">
          <View style={styles.coverOverlay} />

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileTop}>
              <View style={styles.avatar}>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                ) : (
                  <Icon name="account" size={38} color={theme.text} />
                )}
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                  {userName}
                </Text>
                <View style={styles.metaRow}>
                  <Icon name="email-outline" size={16} color={theme.muted} />
                  <Text style={styles.metaText} numberOfLines={1}>
                    {userEmail}
                  </Text>
                </View>
                <View style={styles.metaRow}>
                  <Icon name="phone-outline" size={16} color={theme.muted} />
                  <Text style={styles.metaText} numberOfLines={1}>
                    {userPhone}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.quickActions}>
              <Pressable style={styles.chip} onPress={onPickAvatar}>
                <Icon name="camera-outline" size={18} color={theme.accent} />
                <Text style={styles.chipText}>{t('profile.pickAvatar')}</Text>
              </Pressable>

              <Pressable style={styles.chip} onPress={toggleLanguage}>
                <Icon name="translate" size={18} color={theme.accent} />
                <Text style={styles.chipText}>{t('profile.changeLanguage')}</Text>
              </Pressable>

              <Pressable style={styles.chip} onPress={onResetProfile}>
                <Icon name="restore" size={18} color={theme.accent} />
                <Text style={styles.chipText}>{t('profile.reset')}</Text>
              </Pressable>
            </View>

            {(status.error || status.success) ? (
              <View style={styles.noticeWrap}>
                {status.error ? <Text style={styles.errorText}>{status.error}</Text> : null}
                {status.success ? <Text style={styles.successText}>{status.success}</Text> : null}
              </View>
            ) : null}
          </View>
        </ImageBackground>
      </View>

      {/* Account Settings */}
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
        </View>
      </View>

      {/* Password */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('profile.password')}</Text>
        <View style={styles.card}>
          <InputField
            label={t('profile.currentPassword')}
            secureTextEntry
            value={passwordForm.currentPassword}
            onChangeText={value => setPasswordForm(prev => ({ ...prev, currentPassword: value }))}
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

      {/* Theme */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('profile.theme')}</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Icon name="weather-night" size={18} color={theme.muted} />
              <Text style={styles.label}>{t('profile.themeToggle')}</Text>
            </View>
            <Switch
              value={mode === 'softDark'}
              onValueChange={toggleMode}
              trackColor={{ true: theme.accent, false: theme.border }}
              thumbColor={theme.text}
            />
          </View>
        </View>
      </View>

      {/* Language */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('profile.language')}</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Icon name="translate" size={18} color={theme.muted} />
              <Text style={styles.label}>{t('common.language')}</Text>
            </View>
            <Text style={styles.value}>
              {t('common.arabic')} / {t('common.english')}
            </Text>
          </View>

          <PrimaryButton
            label={t('profile.changeLanguage')}
            variant="secondary"
            onPress={toggleLanguage}
          />
        </View>
      </View>

      {/* Logout */}
      <View style={styles.logoutWrap}>
        <PrimaryButton
          label={t('profile.logout')}
          variant="secondary"
          onPress={async () => {
            await logout();
            goToWelcome();
          }}
        />
      </View>
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
      padding: 18,
      paddingBottom: 36,
      gap: 16,
    },

    /* Guest */
    guestBackground: { flex: 1 },
    guestOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
    },
    guestContent: { flex: 1, justifyContent: 'center', padding: 24 },
    guestCard: {
      backgroundColor: theme.surface,
      borderRadius: 22,
      padding: 24,
      alignItems: 'center',
      gap: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    guestIcon: {
      width: 74,
      height: 74,
      borderRadius: 24,
      backgroundColor: theme.surfaceLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    guestTitle: {
      color: theme.text,
      fontSize: 20,
      fontWeight: '800',
      textAlign: 'center',
    },
    guestSubtitle: {
      color: theme.textDark,
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 8,
    },

    /* Cover + Profile Card */
    coverWrap: {
      borderRadius: 22,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.border,
    },
    cover: {
      minHeight: 230,
      justifyContent: 'flex-end',
    },
    coverOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.35)',
    },
    profileCard: {
      margin: 14,
      borderRadius: 20,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 14,
      gap: 12,
    },
    profileTop: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 14,
    },
    avatar: {
      width: 86,
      height: 86,
      borderRadius: 28,
      backgroundColor: theme.surfaceLight,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: theme.accent,
    },
    avatarImage: { width: '100%', height: '100%' },
    profileInfo: {
      flex: 1,
      alignItems: isRTL ? 'flex-end' : 'flex-start',
      gap: 6,
    },
    name: {
      color: theme.text,
      fontSize: 20,
      fontWeight: '900',
      letterSpacing: 0.2,
      maxWidth: '100%',
    },
    metaRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 8,
      maxWidth: '100%',
    },
    metaText: {
      color: theme.textDark,
      fontSize: 13,
      flexShrink: 1,
    },

    /* Chips */
    quickActions: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    chip: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 999,
      backgroundColor: theme.surfaceLight,
      borderWidth: 1,
      borderColor: theme.border,
    },
    chipText: {
      color: theme.text,
      fontSize: 13,
      fontWeight: '700',
    },

    noticeWrap: {
      borderRadius: 14,
      backgroundColor: theme.surfaceLight,
      padding: 10,
      borderWidth: 1,
      borderColor: theme.border,
      gap: 6,
    },

    /* Sections */
    section: { gap: 10 },
    sectionTitle: {
      color: theme.text,
      fontSize: 15,
      fontWeight: '900',
      textAlign: isRTL ? 'right' : 'left',
      paddingHorizontal: 2,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 18,
      padding: 16,
      gap: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    row: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      gap: 10,
    },
    rowLeft: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 10,
      flexShrink: 1,
    },
    label: {
      color: theme.text,
      fontSize: 14,
      fontWeight: '800',
      flexShrink: 1,
    },
    value: {
      color: theme.textDark,
      fontSize: 13,
      fontWeight: '600',
      flexShrink: 1,
    },

    /* Messages */
    errorText: {
      color: theme.warning,
      fontSize: 12,
      fontWeight: '600',
      textAlign: isRTL ? 'right' : 'left',
    },
    successText: {
      color: theme.accent,
      fontSize: 12,
      fontWeight: '700',
      textAlign: isRTL ? 'right' : 'left',
    },

    disabledButton: { opacity: 0.7 },

    logoutWrap: {
      marginTop: 6,
      paddingTop: 4,
    },
  });
