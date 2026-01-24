import { NativeModules, Platform } from 'react-native';
import appConfig from '../../app.json';

const DEFAULT_API_PORT = 8000;

const getDevServerHost = () => {
  const scriptURL = NativeModules?.SourceCode?.scriptURL;
  if (!scriptURL) return null;
  const match = scriptURL.match(/^https?:\/\/([^/:]+)(?::\d+)?/);
  if (!match) return null;
  const host = match[1];
  if (host === 'localhost' || host === '127.0.0.1') {
    return Platform.OS === 'android' ? '10.0.2.2' : host;
  }
  return host;
};

const normalizeBaseUrl = value => {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim().replace(/\/+$/, '');
  if (!trimmed) return null;
  return trimmed.match(/\/api$/) ? trimmed : `${trimmed}/api`;
};

const getConfigBaseUrl = () => {
  if (global?.API_BASE_URL) {
    return normalizeBaseUrl(global.API_BASE_URL);
  }
  return normalizeBaseUrl(appConfig?.apiBaseUrl);
};

const getBaseUrl = () => {
  const configuredBaseUrl = getConfigBaseUrl();
  if (configuredBaseUrl) {
    return configuredBaseUrl;
  }
  const devHost = getDevServerHost();
  if (devHost) {
    return `http://${devHost}:${DEFAULT_API_PORT}/api`;
  }
  const fallbackHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${fallbackHost}:${DEFAULT_API_PORT}/api`;
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  TIMEOUT_MS: 15000,
};
