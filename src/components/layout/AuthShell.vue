<template>
  <div class="min-h-screen bg-app flex flex-col">
    <header :class="['h-[60px] bg-panel border-b border-app px-4 flex items-center justify-between', pinHeader ? 'sticky top-0' : '']">
      <strong>{{ $t('appTitle') }}</strong>
      <div class="flex gap-2">
        <button class="border border-app rounded px-2" @click="lang = lang === 'en' ? 'fi' : 'en'">{{ lang.toUpperCase() }}</button>
        <button class="border border-app rounded px-2 py-1" @click="dark = !dark" :aria-label="dark ? 'Switch to light mode' : 'Switch to dark mode'">
          <AppIcon v-if="dark" :icon="Sun" />
          <AppIcon v-else :icon="Moon" />
        </button>
        <button class="border border-app rounded px-2 py-1" @click="pinHeader = !pinHeader" :aria-label="pinHeader ? 'Unpin header' : 'Pin header'">
          <AppIcon :icon="Pin" />
        </button>
      </div>
    </header>
    <main class="flex-1 grid place-items-center p-4">
      <slot />
    </main>
    <footer :class="['h-[50px] bg-panel border-t border-app px-4 flex items-center justify-end', pinFooter ? 'sticky bottom-0' : '']">
      <button class="border border-app rounded px-2 py-1" @click="pinFooter = !pinFooter" :aria-label="pinFooter ? 'Unpin footer' : 'Pin footer'">
        <AppIcon :icon="Pin" />
      </button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Moon, Pin, Sun } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import AppIcon from '@/components/common/AppIcon.vue';

const { locale } = useI18n();
const lang = ref(locale.value);
const dark = ref(false);
const pinHeader = ref(false);
const pinFooter = ref(false);

watch(lang, (v) => {
  locale.value = v;
});
watch(dark, (v) => {
  document.documentElement.classList.toggle('dark', v);
});
</script>
