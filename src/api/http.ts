import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useLoadingStore } from '@/stores/loading';
import { getApiErrorMessage } from '@/utils/error';
import router from '@/router';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

http.interceptors.request.use((config) => {
  useLoadingStore().start();
  const auth = useAuthStore();
  if (auth.token) config.headers.Authorization = `Bearer ${auth.token}`;
  return config;
});

http.interceptors.response.use(
  (response) => {
    useLoadingStore().stop();
    return response;
  },
  async (error) => {
    useLoadingStore().stop();
    const status = error?.response?.status;
    const message = getApiErrorMessage(error);

    if (status === 401) {
      useAuthStore().logout(false);
      alert(message);
      await router.replace('/signin');
      return Promise.reject(error);
    }
    if (status === 403) {
      alert(message || 'No permissions');
      if (window.history.length > 1) router.back();
      else await router.replace('/home');
      return Promise.reject(error);
    }
    if (status === 501) {
      alert(message || 'Internal server error');
      return Promise.reject(error);
    }
    if (status && status >= 400 && status !== 410) {
      await router.replace({ path: '/error', query: { code: `${status}`, message } });
    }
    return Promise.reject(error);
  }
);
