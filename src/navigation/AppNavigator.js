import React, { useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AuthScreen from '../screens/AuthScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import ExploreScreen from '../screens/ExploreScreen';
import HomeScreen from '../screens/HomeScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SplashScreen from '../screens/SplashScreen';
import TournamentsScreen from '../screens/TournamentsScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { theme } = useTheme();
  const { t, isRTL } = useLanguage();
  const { user, token } = useAuth();
  const isAuthed = Boolean(user || token);

  const tabs = useMemo(() => {
    const baseTabs = [
      {
        name: 'Home',
        component: HomeScreen,
        label: t('tabs.home'),
        icon: 'home',
        iconSize: 20,
      },
      {
        name: 'Explore',
        component: ExploreScreen,
        label: t('tabs.explore'),
        icon: 'compass',
        iconSize: 20,
      },
      {
        name: 'Create',
        component: CreateEventScreen,
        label: t('tabs.create'),
        icon: 'plus-circle',
        iconSize: 22,
      },
      {
        name: 'Tournaments',
        component: TournamentsScreen,
        label: t('tabs.tournaments'),
        icon: 'trophy',
        iconSize: 20,
      },
      {
        name: 'Profile',
        component: ProfileScreen,
        label: t('tabs.profile'),
        icon: 'account',
        iconSize: 20,
      },
    ];
    return isRTL ? [...baseTabs].reverse() : baseTabs;
  }, [isRTL, t]);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          { backgroundColor: theme.surface, borderTopColor: theme.border },
        ],
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.muted,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      {tabs.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          listeners={({ navigation }) => ({
            tabPress: event => {
              if (!isAuthed && tab.name !== 'Profile') {
                event.preventDefault();
                navigation.navigate('Profile');
              }
            },
          })}
          options={{
            tabBarLabel: tab.label,
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name={tab.icon} size={tab.iconSize} color={color} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Splash"
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopColor: 'transparent',
    height: 70,
    paddingBottom: 12,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
