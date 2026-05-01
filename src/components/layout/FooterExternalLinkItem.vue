<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex h-8 w-8 shrink-0 items-center justify-center opacity-90 transition-opacity hover:opacity-100"
    :title="tooltip"
    :aria-label="tooltip"
  >
    <img
      :src="src"
      :alt="alt"
      :class="imgClass"
    />
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  href: string;
  src: string;
  alt: string;
  tooltip: string;
  variant: 'logo' | 'avatar';
}>();

const imgClass = computed(() => {
  const base = 'min-w-6 max-h-full max-w-full';
  if (props.variant === 'avatar') {
    return `${base} h-full w-full object-cover rounded-full`;
  }
  return `${base} w-auto object-contain rounded-none`;
});
</script>
