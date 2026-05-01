<template>
  <RouterLink
    v-if="to"
    class="block border border-app rounded px-2 py-2"
    :class="itemClass"
    :to="to"
    :title="collapsed ? label : undefined"
  >
    <span class="flex items-center gap-2">
      <AppIcon :icon="icon" />
      <span v-if="!collapsed">{{ label }}</span>
    </span>
  </RouterLink>

  <button
    v-else
    class="border border-app rounded px-2 py-2"
    :class="itemClass"
    :title="collapsed ? label : undefined"
    @click="$emit('click')"
  >
    <span class="flex items-center gap-2">
      <AppIcon :icon="icon" />
      <span v-if="!collapsed">{{ label }}</span>
    </span>
  </button>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import type { RouteLocationRaw } from 'vue-router';
import { RouterLink } from 'vue-router';
import AppIcon from '@/components/common/AppIcon.vue';

withDefaults(defineProps<{
  to?: RouteLocationRaw;
  icon: Component;
  label: string;
  collapsed: boolean;
  itemClass?: string;
}>(), {
  to: undefined,
  itemClass: ''
});

defineEmits<{
  click: [];
}>();
</script>
