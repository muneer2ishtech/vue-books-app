<template>
  <component
    :is="icon"
    :size="size"
    :stroke-width="strokeWidth"
    :class="['shrink-0', iconClass]"
  />
</template>

<script setup lang="ts">
import type { Component } from 'vue';

withDefaults(defineProps<{
  icon: Component;
  size?: number;
  strokeWidth?: number;
  iconClass?: string;
}>(), {
  size: 16,
  strokeWidth: 2,
  iconClass: ''
});
</script>
