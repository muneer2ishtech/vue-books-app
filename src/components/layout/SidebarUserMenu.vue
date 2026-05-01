<template>
  <div class="relative" ref="rootEl">
    <button
      type="button"
      class="w-full border border-app rounded px-2 py-2 text-left hover:bg-white/5 transition-colors"
      :class="collapsed ? 'flex justify-center' : 'flex items-center gap-2 min-w-0'"
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
          class="h-8 w-8 rounded-full object-cover"
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

    <Transition name="sidebar-user-menu">
      <div
        v-if="menuOpen"
        class="absolute bottom-full left-0 right-0 z-30 mb-1 rounded border border-app bg-panel py-1 shadow"
        role="menu"
        @click.stop
      >
        <RouterLink
          to="/me"
          role="menuitem"
          class="block w-full px-3 py-2 text-left text-sm hover:bg-white/10"
          @click="closeMenu"
        >
          {{ $t('profile') }}
        </RouterLink>
        <button
          type="button"
          role="menuitem"
          class="w-full px-3 py-2 text-left text-sm hover:bg-white/10"
          @click="onLogoutClick"
        >
          {{ $t('logout') }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { getValidStr } from '@/utils/jwt';

const props = defineProps<{
  collapsed: boolean;
}>();

const auth = useAuthStore();
const router = useRouter();

const menuOpen = ref(false);
const rootEl = ref<HTMLElement | null>(null);
const photoLoadFailed = ref(false);

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
.sidebar-user-menu-enter-active,
.sidebar-user-menu-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.sidebar-user-menu-enter-from,
.sidebar-user-menu-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
