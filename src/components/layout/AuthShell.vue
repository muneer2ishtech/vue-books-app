<template>
  <div class="min-h-screen bg-app flex flex-col">
    <header :class="['h-[60px] bg-panel border-b border-app px-4 flex items-center justify-between', pinHeader ? 'sticky top-0' : '']">
      <strong class="flex items-center gap-2">
        <img :src="appLogo" alt="Books App logo" class="h-5 w-5 object-contain dark:invert" />
        <span>{{ $t('appTitle') }}</span>
      </strong>
      <div class="flex gap-2">
        <LanguageToggleButton :lang="lang" :trigger-title="$t('language')" @select="setLang" />
        <button class="border border-app rounded px-2 py-1" @click="dark = !dark" :aria-label="dark ? 'Switch to light mode' : 'Switch to dark mode'" :title="dark ? $t('light') : $t('dark')">
          <AppIcon v-if="dark" :icon="Sun" />
          <AppIcon v-else :icon="Moon" />
        </button>
        <HfIconButton
          type="boolean"
          :state="pinHeader"
          :action="() => (pinHeader = !pinHeader)"
          :icon-1="Pin"
          :ari-label1="'Unpin header'"
          :ari-label2="'Pin header'"
          :title-1="$t('unpin')"
          :title-2="$t('pin')"
          :tooltip-text-1="$t('unpin')"
          :tooltip-text-2="$t('pin')"
        />
      </div>
    </header>
    <main class="flex-1 grid place-items-center p-4">
      <slot />
    </main>
    <footer :class="['h-[50px] bg-panel border-t border-app px-4 flex items-center justify-end', pinFooter ? 'sticky bottom-0' : '']">
      <HfIconButton
        type="boolean"
        :state="pinFooter"
        :action="() => (pinFooter = !pinFooter)"
        :icon-1="Pin"
        :ari-label1="'Unpin footer'"
        :ari-label2="'Pin footer'"
        :title-1="$t('unpin')"
        :title-2="$t('pin')"
        :tooltip-text-1="$t('unpin')"
        :tooltip-text-2="$t('pin')"
      />
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Moon, Pin, Sun } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import AppIcon from '@/components/common/AppIcon.vue';
import HfIconButton from '@/components/common/HfIconButton.vue';
import LanguageToggleButton from '@/components/common/LanguageToggleButton.vue';

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
