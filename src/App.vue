<template>
  <GlobalLoadingOverlay />
  <GlobalAlerts />
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';

import GlobalAlerts from '@/components/common/GlobalAlerts.vue';
import GlobalLoadingOverlay from '@/components/common/GlobalLoadingOverlay.vue';
</script>
