import {api} from 'services/axios';

export const loginAdmin = async (login: string, password: string): Promise<boolean> => {
  try {
    const {data} = await api.post<{token: string}>('/admin-auth/login', {login, password});

    if (data?.token) {
      localStorage.setItem('token', data.token);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

export const logoutAdmin = (): void => {
  localStorage.removeItem('token');
  window.location.href = '/stalkers/admin/login';
};
