<template>
  <button
    class="border border-app rounded px-2 py-1"
    :aria-label="resolvedAriaLabel"
    :title="resolvedTooltipText"
    @click="handleClick"
  >
    <AppIcon
      v-if="resolvedIcon"
      :icon="resolvedIcon"
      :icon-class="resolvedFilled ? 'fill-current' : 'fill-none'"
    />
    <span v-else class="text-xs">{{ resolvedTitle }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';
import AppIcon from '@/components/common/AppIcon.vue';

type ButtonType = 'simple' | 'boolean';

// In templates these can be passed as kebab-case:
// icon-1/icon-2, ari-label1/ari-label2, title-1/title-2, tooltip-text-1/tooltip-text-2.
// use ari-label1/ari-label2 prop names to avoid collisions with native aria-* attribute handling

const props = withDefaults(defineProps<{
  type?: ButtonType;
  state?: boolean;
  action?: () => void;
  icon1: Component | string;
  icon2?: Component | string;
  ariLabel1: string;
  ariLabel2?: string;
  title1: string;
  title2?: string;
  tooltipText1: string;
  tooltipText2?: string;
  filling?: boolean;
  changeFilling?: boolean;
}>(), {
  type: 'simple',
  state: false,
  action: undefined,
  icon2: '',
  ariLabel2: '',
  title2: '',
  tooltipText2: '',
  filling: true,
  changeFilling: true
});

const emit = defineEmits<{
  click: [];
}>();

if (import.meta.env.DEV) {
  if (props.type === 'simple') {
    if (hasValue(props.icon2)) {
      console.warn('[HfIconButton] "icon2" is irrelevant when type="simple".');
    }
    if (
      hasValue(props.ariLabel2) ||
      hasValue(props.title2) ||
      hasValue(props.tooltipText2)
    ) {
      console.warn('[HfIconButton] "*2" props are irrelevant when type="simple".');
    }
    if (props.changeFilling !== true) {
      console.warn('[HfIconButton] "changeFilling" is irrelevant when type="simple".');
    }
  }

  if (hasValue(props.icon2) && props.changeFilling !== true) {
    console.warn('[HfIconButton] "changeFilling" is irrelevant when "icon2" is provided.');
  }

  if (typeof props.icon1 === 'string' && props.icon1.trim().length > 0) {
    console.warn('[HfIconButton] "icon-1" should be a component, not a non-empty string.');
  }
  if (typeof props.icon2 === 'string' && props.icon2.trim().length > 0) {
    console.warn('[HfIconButton] "icon-2" should be a component, not a non-empty string.');
  }
}

const resolvedIcon = computed(() => {
  if (props.type === 'boolean' && hasValue(props.icon2)) {
    return props.state ? normalizeIcon(props.icon1) : normalizeIcon(props.icon2);
  }
  return normalizeIcon(props.icon1);
});

const resolvedAriaLabel = computed(() => {
  if (props.type === 'boolean') {
    return props.state
      ? props.ariLabel1
      : fallbackText(props.ariLabel2, props.ariLabel1);
  }
  return props.ariLabel1;
});

const resolvedTitle = computed(() => {
  if (props.type === 'boolean') {
    return props.state
      ? props.title1
      : fallbackText(props.title2, props.title1);
  }
  return props.title1;
});

const resolvedTooltipText = computed(() => {
  if (props.type === 'boolean') {
    return props.state
      ? props.tooltipText1
      : fallbackText(props.tooltipText2, props.tooltipText1);
  }
  return fallbackText(props.tooltipText1, props.title1);
});

const resolvedFilled = computed(() => {
  if (hasValue(props.icon2)) return true;
  if (props.type === 'boolean' && props.changeFilling) {
    return props.state;
  }
  return props.filling;
});

function handleClick() {
  props.action?.();
  emit('click');
}

function hasValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}

function fallbackText(value: string | undefined, fallback: string): string {
  return hasValue(value) ? String(value) : fallback;
}

function normalizeIcon(value: Component | string | undefined): Component | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') return undefined;
  return value;
}
</script>
