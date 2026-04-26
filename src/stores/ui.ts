import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

const PREFS_KEY = 'user_preferences';

export const useUiStore = defineStore('ui', {
  state: () => ({
    lang: 'en',
    isDarkMode: false,
    pinHeader: true,
    pinFooter: false,
    navbarCollapsed: false
  }),
  actions: {
    init() {
      const auth = useAuthStore();
      if (!auth.isAuthenticated) return;
      const raw = localStorage.getItem(PREFS_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as Partial<typeof this.$state>;
      this.lang = data.lang ?? this.lang;
      this.isDarkMode = data.isDarkMode ?? this.isDarkMode;
      this.pinHeader = data.pinHeader ?? this.pinHeader;
      this.pinFooter = data.pinFooter ?? this.pinFooter;
      this.navbarCollapsed = data.navbarCollapsed ?? this.navbarCollapsed;
    },
    persist() {
      if (!useAuthStore().isAuthenticated) return;
      localStorage.setItem(PREFS_KEY, JSON.stringify(this.$state));
    },
    applyTheme() {
      document.documentElement.classList.toggle('dark', this.isDarkMode);
    }
  }
});
