<template>
  <GlobalLoadingOverlay />
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import GlobalLoadingOverlay from '@/components/common/GlobalLoadingOverlay.vue';
</script>
