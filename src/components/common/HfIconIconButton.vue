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

const props = withDefaults(defineProps<{
  type?: ButtonType;
  icon?: Component;
  ariaLabel?: string;
  title?: string;
  tooltipText?: string;
  action?: () => void;
  filling?: boolean;
  state?: boolean;
  ariaLabel1?: string;
  ariaLabel2?: string;
  title1?: string;
  title2?: string;
  tooltipText1?: string;
  tooltipText2?: string;
  changeFilling?: boolean;
}>(), {
  type: 'simple',
  icon: undefined,
  ariaLabel: '',
  title: '',
  tooltipText: '',
  action: undefined,
  filling: true,
  state: false,
  ariaLabel1: '',
  ariaLabel2: '',
  title1: '',
  title2: '',
  tooltipText1: '',
  tooltipText2: '',
  changeFilling: true
});

const emit = defineEmits<{
  click: [];
}>();

const resolvedIcon = computed(() => props.icon);

const resolvedAriaLabel = computed(() => {
  if (props.type === 'boolean') {
    return props.state ? props.ariaLabel1 : props.ariaLabel2;
  }
  return props.ariaLabel;
});

const resolvedTitle = computed(() => {
  if (props.type === 'boolean') {
    return props.state ? props.title1 : props.title2;
  }
  return props.title;
});

const resolvedTooltipText = computed(() => {
  if (props.type === 'boolean') {
    return props.state ? props.tooltipText1 : props.tooltipText2;
  }
  return props.tooltipText || props.title;
});

const resolvedFilled = computed(() => {
  if (props.type === 'boolean' && props.changeFilling) {
    return props.state;
  }
  return props.filling;
});

function handleClick() {
  props.action?.();
  emit('click');
}
</script>
