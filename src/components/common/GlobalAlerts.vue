<template>
  <div class="fixed right-4 top-4 z-[10000] w-full max-w-md space-y-2 pointer-events-none">
    <div
      v-for="item in alerts.items"
      :key="item.id"
      class="pointer-events-auto rounded border px-3 py-2 shadow-md"
      :class="itemClass(item.type)"
      role="alert"
      aria-live="polite"
    >
      <div class="flex items-start justify-between gap-3">
        <p class="text-sm">{{ item.message }}</p>
        <button class="text-xs underline" @click="alerts.remove(item.id)">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAlertsStore, type AlertType } from '@/stores/alerts';

const alerts = useAlertsStore();

function itemClass(type: AlertType) {
  if (type === 'success') return 'bg-green-100 border-green-400 text-green-900';
  if (type === 'error') return 'bg-red-100 border-red-400 text-red-900';
  return 'bg-blue-100 border-blue-400 text-blue-900';
}
</script>
