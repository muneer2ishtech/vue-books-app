<template>
  <div class="min-h-screen bg-app flex flex-col">
    <header :class="['h-[60px] bg-panel border-b border-app px-4 flex items-center justify-between', pinHeader ? 'sticky top-0' : '']">
      <strong class="flex items-center gap-2">
        <img :src="appLogo" alt="Books App logo" class="h-5 w-5 object-contain dark:invert" />
        <span>{{ $t('appTitle') }}</span>
      </strong>
      <div class="flex gap-2">
        <LanguageToggleButton :lang="lang" @toggle="toggleLang" />
        <button class="border border-app rounded px-2 py-1" @click="dark = !dark" :aria-label="dark ? 'Switch to light mode' : 'Switch to dark mode'">
          <AppIcon v-if="dark" :icon="Sun" />
          <AppIcon v-else :icon="Moon" />
        </button>
        <button class="border border-app rounded px-2 py-1" @click="pinHeader = !pinHeader" :aria-label="pinHeader ? 'Unpin header' : 'Pin header'">
          <AppIcon :icon="Pin" :icon-class="pinHeader ? 'fill-current' : 'fill-none'" />
        </button>
      </div>
    </header>
    <main class="flex-1 grid place-items-center p-4">
      <slot />
    </main>
    <footer :class="['h-[50px] bg-panel border-t border-app px-4 flex items-center justify-end', pinFooter ? 'sticky bottom-0' : '']">
      <button class="border border-app rounded px-2 py-1" @click="pinFooter = !pinFooter" :aria-label="pinFooter ? 'Unpin footer' : 'Pin footer'">
        <AppIcon :icon="Pin" :icon-class="pinFooter ? 'fill-current' : 'fill-none'" />
      </button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Moon, Pin, Sun } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import AppIcon from '@/components/common/AppIcon.vue';
import LanguageToggleButton from '@/components/common/LanguageToggleButton.vue';
import appLogo from '@/assets/books-stack-of-three.svg';

const { locale } = useI18n();
const lang = ref(locale.value);
const dark = ref(false);
const pinHeader = ref(false);
const pinFooter = ref(false);
const supportedLangs = ['en', 'fi', 'sv'] as const;

watch(lang, (v) => {
  locale.value = v;
});
watch(dark, (v) => {
  document.documentElement.classList.toggle('dark', v);
});

function toggleLang() {
  const currentIndex = supportedLangs.indexOf(lang.value as (typeof supportedLangs)[number]);
  const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % supportedLangs.length : 0;
  lang.value = supportedLangs[nextIndex];
}
</script>
