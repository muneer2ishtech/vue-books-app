<template>
  <strong class="flex items-center gap-2">
    <img
      :src="src"
      :alt="alt"
      class="h-5 w-5 object-contain dark:invert"
    />
    <span v-if="showTitle && resolvedTitle">{{ resolvedTitle }}</span>
  </strong>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
  defineProps<{
    src?: string;
    alt?: string;
    title?: string;
    showTitle?: boolean;
  }>(),
  {
    src: '/assets/images/logo/books-stack-of-three.svg',
    alt: 'Books App logo',
    showTitle: true
  }
);

const { t } = useI18n();

const resolvedTitle = computed(() =>
  props.title !== undefined ? props.title : t('appTitle')
);
</script>
