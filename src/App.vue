<template>
  <GlobalLoadingOverlay />
  <GlobalAlerts />
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import GlobalLoadingOverlay from '@/components/common/GlobalLoadingOverlay.vue';
import GlobalAlerts from '@/components/common/GlobalAlerts.vue';
</script>
