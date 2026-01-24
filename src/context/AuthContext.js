import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { api, authApi } from '../services/api';
import { registerDeviceToken } from '../services/notifications';
import { unwrapResource } from '../utils/api';
import { getJson, removeItem, saveJson, STORAGE_KEYS } from '../utils/storage';

const defaultAuthState = {
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateUser: async () => {},
};

const AuthContext = createContext(defaultAuthState);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const hydrate = useCallback(async () => {
    const storedUser = await getJson(STORAGE_KEYS.user);
    const storedToken = await getJson(STORAGE_KEYS.token);
    setUser(storedUser);
    setToken(storedToken);
    if (storedToken) {
      try {
        api.setToken(storedToken);
        const result = await authApi.me();
        const freshUser = unwrapResource(result.data?.user) || storedUser;
        setUser(freshUser);
        if (freshUser) {
          await saveJson(STORAGE_KEYS.user, freshUser);
        }
      } catch (error) {
        await removeItem(STORAGE_KEYS.user);
        await removeItem(STORAGE_KEYS.token);
        setUser(null);
        setToken(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (token) {
      registerDeviceToken(token).catch(() => {});
    }
  }, [token]);

  const login = useCallback(async payload => {
    const result = await authApi.login(payload);
    const nextUser = unwrapResource(result.data?.user);
    const nextToken = result.data?.token || result.token || null;
    if (nextUser) {
      await saveJson(STORAGE_KEYS.user, nextUser);
    }
    if (nextToken) {
      await saveJson(STORAGE_KEYS.token, nextToken);
    }
    setUser(nextUser);
    setToken(nextToken);
    api.setToken(nextToken);
    return result;
  }, []);

  const register = useCallback(async payload => {
    const result = await authApi.register(payload);
    const nextUser = unwrapResource(result.data?.user);
    const nextToken = result.data?.token || result.token || null;
    if (nextUser) {
      await saveJson(STORAGE_KEYS.user, nextUser);
    }
    if (nextToken) {
      await saveJson(STORAGE_KEYS.token, nextToken);
    }
    setUser(nextUser);
    setToken(nextToken);
    api.setToken(nextToken);
    return result;
  }, []);

  const logout = useCallback(async () => {
    if (token) {
      try {
        api.setToken(token);
        await authApi.logout();
      } catch (error) {
        // ignore network logout errors
      }
    }
    await removeItem(STORAGE_KEYS.user);
    await removeItem(STORAGE_KEYS.token);
    setUser(null);
    setToken(null);
    api.setToken(null);
  }, [token]);

  const updateUser = useCallback(async nextUser => {
    setUser(nextUser);
    if (nextUser) {
      await saveJson(STORAGE_KEYS.user, nextUser);
    }
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, updateUser }),
    [user, token, loading, login, register, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext) || defaultAuthState;
}
