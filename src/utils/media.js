import { API_CONFIG } from '../constants/api';

const baseUrl = API_CONFIG.BASE_URL.replace(/\/api\/?$/, '');

export const resolveMediaUrl = url => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  if (url.startsWith('/')) {
    return `${baseUrl}${url}`;
  }
  return `${baseUrl}/${url}`;
};
