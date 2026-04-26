import { defineStore } from 'pinia';
import type { JwtPayload } from '@/types';
import { buildPreferences, decodeJwt, normalizeEpochToMs, normalizeRoles } from '@/utils/jwt';
import { useAlertsStore } from './alerts';

const TOKEN_KEY = 'access_token';
const PREFS_KEY = 'user_preferences';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) || '',
    payload: null as JwtPayload | null,
    roles: [] as string[]
  }),
  getters: {
    isAuthenticated: (s) => Boolean(s.token)
  },
  actions: {
    init() {
      if (!this.token) return;
      const payload = decodeJwt(this.token);
      if (!payload || Date.now() >= normalizeEpochToMs(payload.exp)) {
        this.logout(false);
        return;
      }
      this.payload = payload;
      this.roles = normalizeRoles(payload.roles);
    },
    setToken(token: string) {
      this.token = token;
      localStorage.setItem(TOKEN_KEY, token);
      this.payload = decodeJwt(token);
      this.roles = normalizeRoles(this.payload?.roles);
      localStorage.setItem(PREFS_KEY, JSON.stringify(buildPreferences(this.payload)));
    },
    logout(notify = true) {
      this.token = '';
      this.payload = null;
      this.roles = [];
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(PREFS_KEY);
      sessionStorage.clear();
      if (notify) useAlertsStore().push('info', 'Signed out');
    }
  }
});
