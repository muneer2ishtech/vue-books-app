<template>
  <div class="flex gap-2">
    <LanguageToggleButton :lang="lang" :trigger-title="$t('language')" @select="onSelectLang" />
    <HfIconButton
      type="boolean"
      :state="isDarkMode"
      :action="onToggleTheme"
      :icon-1="Sun"
      :icon-2="Moon"
      :filling="false"
      :ari-label1="'Switch to light mode'"
      :ari-label2="'Switch to dark mode'"
      :title-1="$t('light')"
      :title-2="$t('dark')"
      :tooltip-text-1="$t('light')"
      :tooltip-text-2="$t('dark')"
    />
    <PinIconButton
      :state="isPinned"
      :action="onTogglePin"
      :ari-label1="'Unpin header'"
      :ari-label2="'Pin header'"
    />
  </div>
</template>

<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next';

import HfIconButton from '@/components/common/HfIconButton.vue';
import LanguageToggleButton from '@/components/common/LanguageToggleButton.vue';
import PinIconButton from '@/components/common/PinIconButton.vue';

defineProps<{
  lang: string;
  isDarkMode: boolean;
  isPinned: boolean;
  onSelectLang: (langCode: string) => void;
  onToggleTheme: () => void;
  onTogglePin: () => void;
}>();
</script>
