<template>
  <div v-if="loading.isLoading" class="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center">
    <div class="bg-panel px-5 py-3 rounded border border-app">Loading...</div>
  </div>
</template>

<script setup lang="ts">
import { useLoadingStore } from '@/stores/loading';

const loading = useLoadingStore();
</script>
