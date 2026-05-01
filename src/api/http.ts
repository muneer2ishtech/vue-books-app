import axios from 'axios';

import i18n from '@/i18n';
import router from '@/router';
import { useAlertsStore } from '@/stores/alerts';
import { useAuthStore } from '@/stores/auth';
import { useLoadingStore } from '@/stores/loading';
import { getApiErrorMessage } from '@/utils/error';

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
    const requestUrl = String(error?.config?.url || '');
    const onSigninRequest = requestUrl.includes('/api/v1/auth/signin');
    const fallbackByStatus: Record<number, string> = {
      401: i18n.global.t('unauthorized'),
      403: i18n.global.t('forbidden'),
      501: i18n.global.t('notImplemented')
    };
    const messageFromApi = getApiErrorMessage(error);
    const message = error?.response?.data?.message || fallbackByStatus[status] || messageFromApi;
    const alerts = useAlertsStore();

    if (status === 401) {
      if (onSigninRequest || router.currentRoute.value.path === '/signin') {
        return Promise.reject(error);
      }
      useAuthStore().logout(false);
      alerts.push('error', message);
      await router.replace('/signin');
      return Promise.reject(error);
    }
    if (status === 403) {
      alerts.push('error', message);
      if (window.history.length > 1) router.back();
      else await router.replace('/home');
      return Promise.reject(error);
    }
    if (status === 501) {
      alerts.push('error', message);
      return Promise.reject(error);
    }
    if (status === 400) {
      alerts.push('error', message);
      return Promise.reject(error);
    }
    if (status && status >= 400 && status !== 410) {
      await router.replace({ path: '/error', query: { code: `${status}`, message } });
    }
    return Promise.reject(error);
  }
);
