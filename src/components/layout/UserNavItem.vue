<template>
  <div class="relative" ref="rootEl">
    <button
      type="button"
      class="w-full border border-app px-2 py-2 text-left hover:bg-white/5 transition-colors"
      :class="triggerClass"
      :aria-expanded="menuOpen"
      aria-haspopup="menu"
      :aria-label="$t('accountMenu')"
      @click.stop="menuOpen = !menuOpen"
    >
      <template v-if="!collapsed">
        <img
          v-if="showPhotoExpanded"
          :src="resolvedPhotoUrl"
          alt=""
          class="h-8 w-8 shrink-0 rounded-full object-cover"
          @error="onPhotoError"
        />
        <span class="truncate min-w-0 flex-1 text-sm">{{ displayLabel }}</span>
      </template>
      <template v-else>
        <img
          v-if="showPhotoCollapsed"
          :src="resolvedPhotoUrl"
          alt=""
          class="h-8 w-8 shrink-0 rounded-full object-cover"
          @error="onPhotoError"
        />
        <span
          v-else
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold"
          aria-hidden="true"
        >
          {{ initialLetter }}
        </span>
      </template>
    </button>

    <Transition name="user-nav-item">
      <div
        v-if="menuOpen"
        class="absolute bottom-full left-0 right-0 z-30 mb-1 rounded border border-app bg-panel p-1 shadow"
        role="menu"
        @click.stop
      >
        <div class="space-y-1">
          <NavItem
            :to="'/me'"
            :icon="User"
            :label="$t('profile')"
            :collapsed="collapsed"
            item-class="w-full"
          />
          <NavItem
            :icon="LogOut"
            :label="$t('logout')"
            :collapsed="collapsed"
            item-class="w-full"
            @click="onLogoutClick"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { LogOut, User } from 'lucide-vue-next';

import NavItem from '@/components/layout/NavItem.vue';
import { useAuthStore } from '@/stores/auth';
import { getValidStr } from '@/utils/jwt';

const props = defineProps<{
  collapsed: boolean;
}>();

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const menuOpen = ref(false);
const rootEl = ref<HTMLElement | null>(null);
const photoLoadFailed = ref(false);

const triggerClass = computed(() =>
  props.collapsed
    ? 'flex justify-center rounded-full'
    : 'flex items-center gap-2 min-w-0 rounded'
);

const displayLabel = computed(() => {
  const p = auth.payload;
  if (!p) return '—';
  return (
    getValidStr(p.displayName) ??
    getValidStr(p.fullName) ??
    getValidStr(p.sub) ??
    '—'
  );
});

const initialLetter = computed(() => {
  const s = displayLabel.value.trim();
  if (!s || s === '—') return '?';
  return s.charAt(0).toLocaleUpperCase();
});

const resolvedPhotoUrl = computed(() => resolvePhotoUrl(auth.payload?.photoUrl));

const showPhotoExpanded = computed(
  () => !props.collapsed && Boolean(resolvedPhotoUrl.value) && !photoLoadFailed.value
);

const showPhotoCollapsed = computed(
  () => props.collapsed && Boolean(resolvedPhotoUrl.value) && !photoLoadFailed.value
);

watch(
  () => auth.payload?.photoUrl,
  () => {
    photoLoadFailed.value = false;
  }
);

watch(
  () => props.collapsed,
  () => {
    menuOpen.value = false;
  }
);

watch(
  () => route.path,
  () => {
    if (menuOpen.value) {
      closeMenu();
    }
  }
);

function resolvePhotoUrl(url: string | null | undefined): string | undefined {
  const u = typeof url === 'string' ? url.trim() : '';
  if (!u) return undefined;
  if (/^https?:\/\//i.test(u) || u.startsWith('//')) return u;
  const base = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? '';
  return u.startsWith('/') ? `${base}${u}` : `${base}/${u}`;
}

function onPhotoError() {
  photoLoadFailed.value = true;
}

function closeMenu() {
  menuOpen.value = false;
}

function onLogoutClick() {
  closeMenu();
  auth.logout(false);
  router.replace('/signin');
}

function onDocumentPointerDown(event: PointerEvent) {
  if (!rootEl.value) return;
  const target = event.target as Node | null;
  if (target && !rootEl.value.contains(target)) {
    menuOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown, true);
});

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown, true);
});
</script>

<style scoped>
.user-nav-item-enter-active,
.user-nav-item-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.user-nav-item-enter-from,
.user-nav-item-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
