<template>
  <div class="relative" ref="rootEl">
    <button
      class="border border-app rounded px-2 py-1 inline-flex items-center justify-center min-w-[42px]"
      :aria-label="`Current language ${currentLanguage.code.toUpperCase()}`"
      :title="triggerTitle"
      @click="open = !open"
    >
      <img
        v-if="!flagError[currentLanguage.code] && currentLanguage.flagSrc"
        :src="currentLanguage.flagSrc"
        :alt="`${currentLanguage.label} flag`"
        class="h-4 w-5 object-cover rounded-sm"
        @error="flagError[currentLanguage.code] = true"
      />
      <span v-else class="text-xs font-semibold">{{ currentLanguage.code.toUpperCase() }}</span>
    </button>

    <div
      v-if="open"
      class="absolute right-0 mt-1 w-40 bg-panel border border-app rounded shadow z-20 py-1"
    >
      <button
        v-for="item in languageItems"
        :key="item.code"
        class="w-full px-2 py-1.5 text-left hover:bg-white/10 inline-flex items-center gap-2"
        @click="selectLanguage(item.code)"
      >
        <img
          v-if="!flagError[item.code] && item.flagSrc"
          :src="item.flagSrc"
          :alt="`${item.label} flag`"
          class="h-4 w-5 object-cover rounded-sm"
          @error="flagError[item.code] = true"
        />
        <span v-else class="text-xs font-semibold">{{ item.code.toUpperCase() }}</span>
        <span>{{ item.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';

type LangCode = 'en' | 'fi' | 'sv';

const props = defineProps<{
  lang: string;
  triggerTitle?: string;
}>();

const emit = defineEmits<{
  select: [lang: string];
}>();

const open = ref(false);
const rootEl = ref<HTMLElement | null>(null);
const flagError = reactive<Record<string, boolean>>({});
const languageItems = [
  { code: 'en', label: 'English', flagSrc: '/assets/images/flags/GB.svg' },
  { code: 'fi', label: 'Suomi', flagSrc: '/assets/images/flags/FI.svg' },
  { code: 'sv', label: 'Svenska', flagSrc: '/assets/images/flags/SE.svg' }
] as const;

const currentLanguage = computed(() => {
  return languageItems.find((item) => item.code === props.lang) ?? languageItems[0];
});

function selectLanguage(lang: LangCode) {
  open.value = false;
  emit('select', lang);
}

function onDocumentClick(event: MouseEvent) {
  if (!rootEl.value) return;
  const target = event.target as Node | null;
  if (target && !rootEl.value.contains(target)) {
    open.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick);
});
</script>
