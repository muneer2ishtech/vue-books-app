<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden border border-app opacity-90 hover:opacity-100 transition-opacity"
    :class="variant === 'avatar' ? 'rounded-full' : 'rounded-md'"
    :title="tooltip"
    :aria-label="tooltip"
  >
    <img
      :src="src"
      :alt="alt"
      :class="
        variant === 'avatar'
          ? 'h-full w-full object-cover'
          : 'max-h-full max-w-full object-contain dark:brightness-110'
      "
    />
  </a>
</template>

<script setup lang="ts">
defineProps<{
  href: string;
  src: string;
  alt: string;
  tooltip: string;
  variant: 'logo' | 'avatar';
}>();
</script>
