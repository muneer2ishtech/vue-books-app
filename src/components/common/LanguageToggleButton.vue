<template>
  <button class="border border-app rounded px-2 py-1" @click="$emit('toggle')" :aria-label="`Current language ${lang.toUpperCase()}`">
    <img
      v-if="showFlag && flagSrc"
      :src="flagSrc"
      :alt="`${lang.toUpperCase()} flag`"
      class="h-4 w-5 object-cover rounded-sm"
      @error="showFlag = false"
    />
    <span v-else>{{ lang.toUpperCase() }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  lang: string;
}>();

defineEmits<{
  toggle: [];
}>();

const showFlag = ref(true);
const langFlagMap: Record<string, string> = {
  en: '/assets/images/flags/GB.svg',
  fi: '/assets/images/flags/FI.svg'
};
const flagSrc = computed(() => langFlagMap[props.lang] ?? '');

watch(
  () => props.lang,
  () => {
    showFlag.value = true;
  }
);
</script>
