import React from 'react';
import {
  ImageBackground,
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
import { colors } from '../styles/colors';

export default function LoginScreen() {
  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80',
      }}
      style={styles.background}
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.container}>
        <View>
          <View style={styles.logoRow}>
            <View style={styles.logo}>
              <Icon name="ticket-confirmation" size={24} color={colors.text} />
            </View>
            <View>
              <Text style={styles.title}>أهلاً بك مجدداً</Text>
              <Text style={styles.subtitle}>
                اكتشف الفعاليات، أنشئها، وشارك فيها بسهولة
              </Text>
            </View>
          </View>

          <View style={styles.segmented}>
            <CategoryPill label="تسجيل الدخول" active />
            <CategoryPill label="إنشاء حساب" />
          </View>

          <View style={styles.form}>
            <InputField
              label="البريد الإلكتروني"
              placeholder="example@email.com"
              leadingIcon={<Icon name="email-outline" size={18} color={colors.text} />}
            />
            <InputField
              label="كلمة المرور"
              placeholder="••••••••"
              secureTextEntry
              leadingIcon={<Icon name="eye-outline" size={18} color={colors.text} />}
              trailingIcon={<Icon name="emoticon-outline" size={18} color={colors.text} />}
            />
            <Text style={styles.link}>هل نسيت كلمة المرور؟</Text>
            <PrimaryButton
              label="تسجيل الدخول"
              iconComponent={
                <Icon name="arrow-left" size={18} color={colors.text} />
              }
            />
          </View>
        </View>

        <View>
          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>أو استمر باستخدام</Text>
            <View style={styles.divider} />
          </View>
          <View style={styles.socialRow}>
            <SocialButton
              label="Apple"
              icon={<Icon family="fa5" name="apple" size={16} color={colors.text} />}
            />
            <SocialButton
              label="Google"
              icon={<Icon family="fa5" name="google" size={16} color={colors.text} />}
            />
            <SocialButton
              label="X"
              icon={<Icon family="fa5" name="x-twitter" size={16} color={colors.text} />}
            />
          </View>
          <Text style={styles.terms}>
            بمتابعتك، أنت توافق على شروط الخدمة وسياسة الخصوصية
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
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
  logoRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
    marginTop: 12,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'right',
  },
  subtitle: {
    color: colors.textDark,
    fontSize: 13,
    marginTop: 6,
    textAlign: 'right',
  },
  segmented: {
    flexDirection: 'row-reverse',
    gap: 12,
    marginTop: 20,
  },
  form: {
    marginTop: 20,
    gap: 16,
  },
  link: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },
  dividerRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.muted,
    fontSize: 12,
  },
  socialRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    gap: 10,
  },
  terms: {
    color: colors.muted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
  },
});
