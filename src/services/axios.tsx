import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/admin-auth/login');

    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('token');

      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/stalkers/admin/login';
      }
    }

    return Promise.reject(error);
  }
);
