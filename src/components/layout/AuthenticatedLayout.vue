<template>
  <div class="min-h-screen flex">
    <aside class="fixed left-0 top-0 bottom-0 bg-panel border-r border-app transition-all duration-300"
      :style="{ width: ui.navbarCollapsed ? '80px' : '256px' }">
      <div class="h-[60px] border-b border-app px-3 flex items-center justify-between">
        <strong v-if="!ui.navbarCollapsed">Books App</strong>
        <button class="border border-app rounded px-2 py-1" @click="toggleNav" :aria-label="ui.navbarCollapsed ? 'Expand navigation' : 'Collapse navigation'">
          <PanelLeftClose v-if="ui.navbarCollapsed" :size="16" />
          <PanelLeftOpen v-else :size="16" />
        </button>
      </div>
      <nav class="p-2 space-y-1">
        <RouterLink class="block border border-app rounded px-2 py-2" to="/home">
          <span class="flex items-center gap-2">
            <House :size="16" />
            <span v-if="!ui.navbarCollapsed">{{ $t('home') }}</span>
          </span>
        </RouterLink>
        <RouterLink
          v-if="canBooks"
          class="block border border-app rounded px-2 py-2"
          to="/books"
        >
          <span class="flex items-center gap-2">
            <BookCopy :size="16" />
            <span v-if="!ui.navbarCollapsed">{{ $t('books') }}</span>
          </span>
        </RouterLink>
      </nav>
      <div class="absolute bottom-0 w-full p-2 border-t border-app">
        <RouterLink class="block border border-app rounded px-2 py-2 mb-1" to="/me">
          <span class="flex items-center gap-2">
            <User :size="16" />
            <span v-if="!ui.navbarCollapsed">{{ $t('profile') }}</span>
          </span>
        </RouterLink>
        <button class="w-full border border-app rounded px-2 py-2" @click="logout">
          <span class="flex items-center gap-2">
            <LogOut :size="16" />
            <span v-if="!ui.navbarCollapsed">{{ $t('logout') }}</span>
          </span>
        </button>
      </div>
    </aside>

    <div class="flex-1 flex flex-col transition-all duration-300" :style="{ marginLeft: ui.navbarCollapsed ? '80px' : '256px' }">
      <header :class="['h-[60px] bg-panel border-b border-app px-4 flex items-center justify-between', ui.pinHeader ? 'sticky top-0 z-10' : '']">
        <div class="text-muted">{{ route.path }}</div>
        <div class="flex gap-2">
          <button class="border border-app rounded px-2" @click="toggleLang">{{ ui.lang.toUpperCase() }}</button>
          <button class="border border-app rounded px-2 py-1" @click="toggleTheme" :aria-label="ui.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'">
            <Sun v-if="ui.isDarkMode" :size="16" />
            <Moon v-else :size="16" />
          </button>
          <button class="border border-app rounded px-2 py-1" @click="ui.pinHeader = !ui.pinHeader" :aria-label="ui.pinHeader ? 'Unpin header' : 'Pin header'">
            <Pin :size="16" />
          </button>
        </div>
      </header>
      <main class="flex-1 p-4 overflow-auto">
        <RouterView />
      </main>
      <footer :class="['h-[50px] bg-panel border-t border-app px-4 flex items-center justify-end', ui.pinFooter ? 'sticky bottom-0 z-10' : '']">
        <button class="border border-app rounded px-2 py-1" @click="ui.pinFooter = !ui.pinFooter" :aria-label="ui.pinFooter ? 'Unpin footer' : 'Pin footer'">
          <Pin :size="16" />
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUiStore } from '@/stores/ui';
import { useI18n } from 'vue-i18n';
import { BookCopy, House, LogOut, Moon, PanelLeftClose, PanelLeftOpen, Pin, Sun, User } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
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

function toggleLang() {
  ui.lang = ui.lang === 'en' ? 'fi' : 'en';
  locale.value = ui.lang;
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
