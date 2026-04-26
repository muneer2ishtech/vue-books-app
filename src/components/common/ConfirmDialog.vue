<template>
  <div v-if="open" class="fixed inset-0 bg-black/50 z-50 grid place-items-center p-4">
    <div class="w-full max-w-sm bg-panel rounded border border-app p-4">
      <h3 class="font-semibold mb-2">{{ title }}</h3>
      <p class="text-muted mb-4">{{ message }}</p>
      <div class="flex justify-end gap-2">
        <button class="border border-app rounded px-3 py-1" @click="$emit('cancel')">Cancel</button>
        <button class="bg-red-600 text-white rounded px-3 py-1" @click="$emit('confirm')">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ open: boolean; title: string; message: string }>();
defineEmits<{ (e: 'cancel'): void; (e: 'confirm'): void }>();
</script>
