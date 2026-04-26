<template>
  <div class="min-h-screen bg-app flex flex-col">
    <header :class="['h-[60px] bg-panel border-b border-app px-4 flex items-center justify-between', pinHeader ? 'sticky top-0' : '']">
      <strong>{{ $t('appTitle') }}</strong>
      <div class="flex gap-2">
        <button class="border border-app rounded px-2" @click="lang = lang === 'en' ? 'fi' : 'en'">{{ lang.toUpperCase() }}</button>
        <button class="border border-app rounded px-2" @click="dark = !dark">Theme</button>
        <button class="border border-app rounded px-2" @click="pinHeader = !pinHeader">Pin H</button>
      </div>
    </header>
    <main class="flex-1 grid place-items-center p-4">
      <slot />
    </main>
    <footer :class="['h-[50px] bg-panel border-t border-app px-4 flex items-center justify-end', pinFooter ? 'sticky bottom-0' : '']">
      <button class="border border-app rounded px-2" @click="pinFooter = !pinFooter">Pin F</button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

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
