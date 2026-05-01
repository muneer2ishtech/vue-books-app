<template>
  <div class="min-h-screen flex">
    <aside class="fixed left-0 top-0 bottom-0 bg-panel border-r border-app transition-all duration-300"
      :style="{ width: ui.navbarCollapsed ? '80px' : '256px' }">
      <div class="h-[60px] border-b border-app px-3 flex items-center justify-between">
        <AppLogo :show-title="!ui.navbarCollapsed" />
        <HfIconButton
          type="boolean"
          :state="ui.navbarCollapsed"
          :action="toggleNav"
          :icon-1="PanelLeftOpen"
          :icon-2="PanelLeftClose"
          :filling="false"
          :ari-label1="$t('expandNavigation')"
          :ari-label2="$t('collapseNavigation')"
          :title-1="$t('expandNavigation')"
          :title-2="$t('collapseNavigation')"
          :tooltip-text-1="$t('expandNavigation')"
          :tooltip-text-2="$t('collapseNavigation')"
        />
      </div>
      <nav class="p-2 space-y-1">
        <NavItem
          :to="'/home'"
          :icon="House"
          :label="$t('home')"
          :collapsed="ui.navbarCollapsed"
        />
        <NavItem
          v-if="canBooks"
          :to="'/books'"
          :icon="BookCopy"
          :label="$t('books')"
          :collapsed="ui.navbarCollapsed"
        />
      </nav>
      <div class="absolute bottom-0 w-full p-2 border-t border-app">
        <UserNavItem :collapsed="ui.navbarCollapsed" />
      </div>
    </aside>

    <div class="flex-1 flex flex-col transition-all duration-300" :style="{ marginLeft: ui.navbarCollapsed ? '80px' : '256px' }">
      <header :class="['h-[60px] bg-panel border-b border-app px-4 flex items-center justify-between', ui.pinHeader ? 'sticky top-0 z-10' : '']">
        <div class="text-muted">{{ route.path }}</div>
        <HeaderActionIcons
          :lang="ui.lang"
          :is-dark-mode="ui.isDarkMode"
          :is-pinned="ui.pinHeader"
          :on-select-lang="setLang"
          :on-toggle-theme="toggleTheme"
          :on-toggle-pin="() => (ui.pinHeader = !ui.pinHeader)"
        />
      </header>
      <main class="flex-1 p-4 overflow-auto">
        <RouterView />
      </main>
      <footer :class="['h-[50px] bg-panel border-t border-app px-4 flex items-center justify-end gap-2', ui.pinFooter ? 'sticky bottom-0 z-10' : '']">
        <FooterExternalLinks />
        <FooterActionIcons
          :is-pinned="ui.pinFooter"
          :on-toggle-pin="() => (ui.pinFooter = !ui.pinFooter)"
        />
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { BookCopy, House, PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next';

import AppLogo from '@/components/common/AppLogo.vue';
import FooterActionIcons from '@/components/common/FooterActionIcons.vue';
import HfIconButton from '@/components/common/HfIconButton.vue';
import HeaderActionIcons from '@/components/common/HeaderActionIcons.vue';
import FooterExternalLinks from '@/components/layout/FooterExternalLinks.vue';
import NavItem from '@/components/layout/NavItem.vue';
import UserNavItem from '@/components/layout/UserNavItem.vue';
import { useAuthStore } from '@/stores/auth';
import { useUiStore } from '@/stores/ui';

const route = useRoute();
const auth = useAuthStore();
const ui = useUiStore();
const { locale } = useI18n();

auth.init();
ui.init();
ui.applyTheme();
locale.value = ui.lang;

watch(
  () => ui.$state,
  () => {
    ui.persist();
  },
  { deep: true }
);

const canBooks = computed(() => auth.roles.includes('USER') || auth.roles.includes('ADMIN'));
function setLang(lang: string) {
  ui.lang = lang;
  locale.value = lang;
}
function toggleTheme() {
  ui.isDarkMode = !ui.isDarkMode;
  ui.applyTheme();
}
function toggleNav() {
  ui.navbarCollapsed = !ui.navbarCollapsed;
}
</script>
