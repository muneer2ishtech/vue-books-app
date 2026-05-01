<template>
  <HfIconButton
    type="boolean"
    :state="state"
    :action="action"
    :icon-1="Pin"
    :ari-label1="ariLabel1"
    :ari-label2="ariLabel2"
    :title-1="resolvedTitle1"
    :title-2="resolvedTitle2"
    :tooltip-text-1="resolvedTooltipText1"
    :tooltip-text-2="resolvedTooltipText2"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Pin } from 'lucide-vue-next';
import HfIconButton from '@/components/common/HfIconButton.vue';

const props = withDefaults(defineProps<{
  state: boolean;
  action?: () => void;
  ariLabel1?: string;
  ariLabel2?: string;
  title1?: string;
  title2?: string;
  tooltipText1?: string;
  tooltipText2?: string;
}>(), {
  action: undefined,
  ariLabel1: 'Unpin',
  ariLabel2: 'Pin',
  title1: '',
  title2: '',
  tooltipText1: '',
  tooltipText2: ''
});

const { t } = useI18n();

const resolvedTitle1 = computed(() => props.title1 || t('unpin'));
const resolvedTitle2 = computed(() => props.title2 || t('pin'));
const resolvedTooltipText1 = computed(() => props.tooltipText1 || resolvedTitle1.value);
const resolvedTooltipText2 = computed(() => props.tooltipText2 || resolvedTitle2.value);
</script>
