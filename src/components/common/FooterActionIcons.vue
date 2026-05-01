<template>
  <div class="flex gap-2">
    <PinIconButton
      :state="isPinned"
      :action="onTogglePin"
      :ari-label1="'Unpin footer'"
      :ari-label2="'Pin footer'"
    />
  </div>
</template>

<script setup lang="ts">
import PinIconButton from '@/components/common/PinIconButton.vue';

defineProps<{
  isPinned: boolean;
  onTogglePin: () => void;
}>();
</script>
