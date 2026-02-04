import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { api, authApi } from '../services/api';
import { getJson, removeItem, saveJson, STORAGE_KEYS } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 تحميل البيانات المخزنة
  useEffect(() => {
    (async () => {
      const storedUser = await getJson(STORAGE_KEYS.user);
      const storedToken = await getJson(STORAGE_KEYS.token);

      if (storedToken) {
        api.setToken(storedToken);
        setToken(storedToken);
      }

      if (storedUser) {
        setUser(storedUser);
      }

      setLoading(false);
    })();
  }, []);

  // ✅ LOGIN
  const login = useCallback(async payload => {
    const result = await authApi.login(payload);

    // fetch يرجّع JSON مباشرة
    const data = result?.data || result || {};
    const nextUser = data.user;
    const nextToken = data.token;

    if (!nextUser || !nextToken) {
      throw new Error('Invalid login response');
    }

    await saveJson(STORAGE_KEYS.user, nextUser);
    await saveJson(STORAGE_KEYS.token, nextToken);

    api.setToken(nextToken);
    setUser(nextUser);
    setToken(nextToken);

    return nextUser;
  }, []);

  // ✅ REGISTER (بدون تسجيل دخول)
  const register = useCallback(async payload => {
    return await authApi.register(payload);
  }, []);

  // ✅ LOGOUT
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (e) {}

    await removeItem(STORAGE_KEYS.user);
    await removeItem(STORAGE_KEYS.token);

    api.setToken(null);
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isLoggedIn: !!user && !!token,
      login,
      register,
      logout,
    }),
    [user, token, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
