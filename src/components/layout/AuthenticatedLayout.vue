<template>
  <div class="min-h-screen flex">
    <aside class="fixed left-0 top-0 bottom-0 bg-panel border-r border-app transition-all duration-300"
      :style="{ width: ui.navbarCollapsed ? '80px' : '256px' }">
      <div class="h-[60px] border-b border-app px-3 flex items-center justify-between">
        <strong class="flex items-center gap-2">
          <img :src="appLogo" alt="Books App logo" class="h-5 w-5 object-contain dark:invert" />
          <span v-if="!ui.navbarCollapsed">Books App</span>
        </strong>
        <button class="border border-app rounded px-2 py-1" @click="toggleNav" :aria-label="ui.navbarCollapsed ? 'Expand navigation' : 'Collapse navigation'">
          <AppIcon v-if="ui.navbarCollapsed" :icon="PanelLeftOpen" />
          <AppIcon v-else :icon="PanelLeftClose" />
        </button>
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
        <NavItem
          :to="'/me'"
          :icon="User"
          :label="$t('profile')"
          :collapsed="ui.navbarCollapsed"
          item-class="mb-1"
        />
        <NavItem
          :icon="LogOut"
          :label="$t('logout')"
          :collapsed="ui.navbarCollapsed"
          item-class="w-full"
          @click="logout"
        />
      </div>
    </aside>

    <div class="flex-1 flex flex-col transition-all duration-300" :style="{ marginLeft: ui.navbarCollapsed ? '80px' : '256px' }">
      <header :class="['h-[60px] bg-panel border-b border-app px-4 flex items-center justify-between', ui.pinHeader ? 'sticky top-0 z-10' : '']">
        <div class="text-muted">{{ route.path }}</div>
        <div class="flex gap-2">
          <LanguageToggleButton :lang="ui.lang" :trigger-title="$t('language')" @select="setLang" />
          <HfIconButton
            type="boolean"
            :state="ui.isDarkMode"
            :action="toggleTheme"
            :icon-1="Sun"
            :icon-2="Moon"
            :ari-label1="'Switch to light mode'"
            :ari-label2="'Switch to dark mode'"
            :title-1="$t('light')"
            :title-2="$t('dark')"
            :tooltip-text-1="$t('light')"
            :tooltip-text-2="$t('dark')"
          />
          <PinIconButton
            :state="ui.pinHeader"
            :action="() => (ui.pinHeader = !ui.pinHeader)"
            :ari-label1="'Unpin header'"
            :ari-label2="'Pin header'"
          />
        </div>
      </header>
      <main class="flex-1 p-4 overflow-auto">
        <RouterView />
      </main>
      <footer :class="['h-[50px] bg-panel border-t border-app px-4 flex items-center justify-end', ui.pinFooter ? 'sticky bottom-0 z-10' : '']">
        <PinIconButton
          :state="ui.pinFooter"
          :action="() => (ui.pinFooter = !ui.pinFooter)"
          :ari-label1="'Unpin footer'"
          :ari-label2="'Pin footer'"
        />
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUiStore } from '@/stores/ui';
import { useI18n } from 'vue-i18n';
import { BookCopy, House, LogOut, Moon, PanelLeftClose, PanelLeftOpen, Sun, User } from 'lucide-vue-next';
import AppIcon from '@/components/common/AppIcon.vue';
import HfIconButton from '@/components/common/HfIconButton.vue';
import LanguageToggleButton from '@/components/common/LanguageToggleButton.vue';
import NavItem from '@/components/layout/NavItem.vue';
import PinIconButton from '@/components/common/PinIconButton.vue';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const ui = useUiStore();
const { locale } = useI18n();
const appLogo = '/assets/images/logo/books-stack-of-three.svg';

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
function logout() {
  auth.logout(false);
  router.replace('/signin');
}
</script>
