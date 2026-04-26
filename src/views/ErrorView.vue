<template>
  <div class="min-h-screen grid place-items-center">
    <div class="bg-panel border border-app rounded p-5 max-w-md w-full">
      <h1 class="text-xl font-semibold mb-2">Error {{ code }}</h1>
      <p class="text-muted">{{ message || 'Unexpected error' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const code = computed(() => String(route.query.code ?? ''));
const message = computed(() => String(route.query.message ?? ''));
</script>
