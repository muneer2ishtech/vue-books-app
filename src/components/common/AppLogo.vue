<template>
  <strong class="flex items-center gap-2">
    <img
      :src="src"
      :alt="alt"
      class="h-5 w-5 object-contain dark:invert"
    />
    <span v-if="showTitle && title">{{ title }}</span>
  </strong>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    src?: string;
    alt?: string;
    title?: string;
    showTitle?: boolean;
  }>(),
  {
    src: '/assets/images/logo/books-stack-of-three.svg',
    alt: 'Books App logo',
    title: '',
    showTitle: true
  }
);
</script>
