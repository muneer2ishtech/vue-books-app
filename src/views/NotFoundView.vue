<template>
  <div class="min-h-screen grid place-items-center">
    <div class="text-center">
      <h1 class="text-3xl font-bold">404</h1>
      <p class="text-muted mb-2">{{ $t('notFound') }}</p>
      <RouterLink to="/home" class="underline">Go Home</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>
