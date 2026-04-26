import { defineStore } from 'pinia';

export type AlertType = 'success' | 'error' | 'info';

export interface AlertItem {
  id: number;
  type: AlertType;
  message: string;
}

export const useAlertsStore = defineStore('alerts', {
  state: () => ({
    items: [] as AlertItem[],
    nextId: 1
  }),
  actions: {
    push(type: AlertType, message: string, timeoutMs = 5000) {
      const id = this.nextId++;
      this.items.push({ id, type, message });
      if (timeoutMs > 0) {
        window.setTimeout(() => this.remove(id), timeoutMs);
      }
      return id;
    },
    remove(id: number) {
      this.items = this.items.filter((item) => item.id !== id);
    },
    clear() {
      this.items = [];
    }
  }
});
