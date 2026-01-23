import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../services/api';
import { getJson, removeItem, saveJson, STORAGE_KEYS } from '../utils/storage';

const defaultAuthState = {
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
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
    setLoading(false);
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const login = useCallback(async payload => {
    const result = await authApi.login(payload);
    const nextUser = result.user || result.data || null;
    const nextToken = result.token || result.access_token || null;
    if (nextUser) {
      await saveJson(STORAGE_KEYS.user, nextUser);
    }
    if (nextToken) {
      await saveJson(STORAGE_KEYS.token, nextToken);
    }
    setUser(nextUser);
    setToken(nextToken);
    return result;
  }, []);

  const register = useCallback(async payload => {
    const result = await authApi.register(payload);
    const nextUser = result.user || result.data || null;
    const nextToken = result.token || result.access_token || null;
    if (nextUser) {
      await saveJson(STORAGE_KEYS.user, nextUser);
    }
    if (nextToken) {
      await saveJson(STORAGE_KEYS.token, nextToken);
    }
    setUser(nextUser);
    setToken(nextToken);
    return result;
  }, []);

  const logout = useCallback(async () => {
    if (token) {
      try {
        await authApi.logout(token);
      } catch (error) {
        // ignore network logout errors
      }
    }
    await removeItem(STORAGE_KEYS.user);
    await removeItem(STORAGE_KEYS.token);
    setUser(null);
    setToken(null);
  }, [token]);

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext) || defaultAuthState;
}
