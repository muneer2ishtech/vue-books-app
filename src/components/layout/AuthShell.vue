<template>
  <div class="min-h-screen bg-app flex flex-col">
    <header :class="['h-[60px] bg-panel border-b border-app px-4 flex items-center justify-between', pinHeader ? 'sticky top-0' : '']">
      <strong class="flex items-center gap-2">
        <img :src="appLogo" alt="Books App logo" class="h-5 w-5 object-contain dark:invert" />
        <span>{{ $t('appTitle') }}</span>
      </strong>
      <HeaderActionIcons
        :lang="lang"
        :is-dark-mode="dark"
        :is-pinned="pinHeader"
        :on-select-lang="setLang"
        :on-toggle-theme="() => (dark = !dark)"
        :on-toggle-pin="() => (pinHeader = !pinHeader)"
      />
    </header>
    <main class="flex-1 grid place-items-center p-4">
      <slot />
    </main>
    <footer :class="['h-[50px] bg-panel border-t border-app px-4 flex items-center justify-end', pinFooter ? 'sticky bottom-0' : '']">
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
import HeaderActionIcons from '@/components/common/HeaderActionIcons.vue';
import FooterActionIcons from '@/components/common/FooterActionIcons.vue';

const { locale } = useI18n();
const lang = ref(locale.value);
const dark = ref(false);
const pinHeader = ref(false);
const pinFooter = ref(false);
const appLogo = '/assets/images/logo/books-stack-of-three.svg';

watch(lang, (v) => {
  locale.value = v;
});
watch(dark, (v) => {
  document.documentElement.classList.toggle('dark', v);
});

function setLang(langCode: string) {
  lang.value = langCode;
}
</script>
