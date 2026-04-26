import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
  state: () => ({ count: 0 }),
  getters: {
    isLoading: (s) => s.count > 0
  },
  actions: {
    start() {
      this.count += 1;
    },
    stop() {
      this.count = Math.max(0, this.count - 1);
    }
  }
});
