import { API_CONFIG } from '../constants/api';

const withTimeout = async (promise, timeoutMs) => {
  let timeout;
  const timeoutPromise = new Promise((_, reject) => {
    timeout = setTimeout(() => reject(new Error('Request timed out')), timeoutMs);
  });
  const result = await Promise.race([promise, timeoutPromise]);
  clearTimeout(timeout);
  return result;
};

class ApiService {
  constructor() {
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  async request(path, options = {}) {
    const url = `${API_CONFIG.BASE_URL}${path}`;
    const headers = {
      Accept: 'application/json',
      ...(options.headers || {}),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const isFormData = options.body instanceof FormData;
    if (!isFormData && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const mergedOptions = {
      ...options,
      headers,
    };

    if (mergedOptions.body && !isFormData && typeof mergedOptions.body !== 'string') {
      mergedOptions.body = JSON.stringify(mergedOptions.body);
    }

    const response = await withTimeout(fetch(url, mergedOptions), API_CONFIG.TIMEOUT_MS);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data?.message || 'Request failed';
      const error = new Error(message);
      error.response = data;
      error.status = response.status;
      throw error;
    }
    return data;
  }

  get(path) {
    return this.request(path, { method: 'GET' });
  }

  post(path, body, options = {}) {
    return this.request(path, { method: 'POST', body, ...options });
  }

  put(path, body, options = {}) {
    return this.request(path, { method: 'PUT', body, ...options });
  }

  delete(path) {
    return this.request(path, { method: 'DELETE' });
  }
}

export const api = new ApiService();

const buildQuery = params => {
  const entries = Object.entries(params || {}).filter(
    ([, value]) => value !== undefined && value !== null && value !== ''
  );
  return new URLSearchParams(entries).toString();
};

export const authApi = {
  login: payload => api.post('/auth/login', payload),
  register: payload => api.post('/auth/register', payload),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const homeApi = {
  getHome: () => api.get('/home'),
};

export const categoryApi = {
  list: () => api.get('/categories'),
};

export const eventsApi = {
  list: params => {
    const query = buildQuery(params);
    return api.get(`/events${query ? `?${query}` : ''}`);
  },
  show: id => api.get(`/events/${id}`),
  create: payload => api.post('/events', payload),
  update: (id, payload) => api.put(`/events/${id}`, payload),
  remove: id => api.delete(`/events/${id}`),
  like: id => api.post(`/events/${id}/like`),
  unlike: id => api.delete(`/events/${id}/like`),
  book: id => api.post(`/events/${id}/book`),
};

export const tournamentsApi = {
  list: params => {
    const query = buildQuery(params);
    return api.get(`/tournaments${query ? `?${query}` : ''}`);
  },
  show: id => api.get(`/tournaments/${id}`),
  create: payload => api.post('/tournaments', payload),
  update: (id, payload) => api.put(`/tournaments/${id}`, payload),
  remove: id => api.delete(`/tournaments/${id}`),
};

export const profileApi = {
  show: () => api.get('/profile'),
  update: payload => api.put('/profile', payload),
  updatePassword: payload => api.put('/profile/password', payload),
  uploadAvatar: payload => api.post('/profile/avatar', payload),
};
