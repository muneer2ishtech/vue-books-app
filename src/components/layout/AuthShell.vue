<template>
  <div class="min-h-screen bg-app flex flex-col">
    <header :class="['h-[60px] bg-panel border-b border-app px-4 flex items-center justify-between', pinHeader ? 'sticky top-0' : '']">
      <AppLogo />
      <HeaderActionIcons
        :lang="lang"
        :is-dark-mode="isDarkMode"
        :is-pinned="pinHeader"
        :on-select-lang="setLang"
        :on-toggle-theme="toggleTheme"
        :on-toggle-pin="() => (pinHeader = !pinHeader)"
      />
    </header>
    <main class="flex-1 grid place-items-center p-4">
      <slot />
    </main>
    <footer :class="['h-[50px] bg-panel border-t border-app px-4 flex items-center justify-end gap-2', pinFooter ? 'sticky bottom-0' : '']">
      <FooterExternalLinks />
      <FooterActionIcons
        :is-pinned="pinFooter"
        :on-toggle-pin="() => (pinFooter = !pinFooter)"
      />
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import AppLogo from '@/components/common/AppLogo.vue';
import FooterActionIcons from '@/components/common/FooterActionIcons.vue';
import HeaderActionIcons from '@/components/common/HeaderActionIcons.vue';
import FooterExternalLinks from '@/components/layout/FooterExternalLinks.vue';

const { locale } = useI18n();
const lang = ref(locale.value);
const isDarkMode = ref(false);
const pinHeader = ref(false);
const pinFooter = ref(false);

watch(lang, (v) => {
  locale.value = v;
});
watch(isDarkMode, (v) => {
  document.documentElement.classList.toggle('dark', v);
});

function setLang(langCode: string) {
  lang.value = langCode;
}

function toggleTheme() {
  isDarkMode.value = !isDarkMode.value;
}
</script>
