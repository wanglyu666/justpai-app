<template>
  <slot />
</template>

<script setup lang="ts">
import { Comment, Text, onMounted, onUnmounted, onUpdated, useSlots } from 'vue';
import type { VNode } from 'vue';
import {
  FADE_DURATION_MS,
  FADE_EASING,
} from '@/utils/fadeTransition';

withDefaults(
  defineProps<{
    mode?: 'default' | 'in-out' | 'out-in';
  }>(),
  {
    mode: 'out-in',
  },
);

const emit = defineEmits<{
  afterEnter: [el: Element];
  afterLeave: [el: Element];
}>();

const slots = useSlots();
let lastSlotKey: string | null = null;
let enterTimer: ReturnType<typeof setTimeout> | null = null;

const clearEnterTimer = () => {
  if (enterTimer) {
    clearTimeout(enterTimer);
    enterTimer = null;
  }
};

const emitEntered = () => {
  clearEnterTimer();
  emit('afterEnter', undefined as unknown as Element);
};

const readSlotKey = () => {
  const nodes = slots.default?.() ?? [];
  const node = nodes.find(
    (item): item is VNode =>
      !!item && typeof item === 'object' && item.type !== Comment && item.type !== Text,
  );
  if (!node) return 'empty';
  return String(node.key ?? 'default');
};

const syncSlotKey = () => {
  const slotKey = readSlotKey();
  if (lastSlotKey === slotKey) return;
  lastSlotKey = slotKey;
  clearEnterTimer();
  enterTimer = setTimeout(emitEntered, FADE_DURATION_MS);
};

onMounted(syncSlotKey);
onUpdated(syncSlotKey);

onUnmounted(() => {
  clearEnterTimer();
});

defineExpose({
  duration: FADE_DURATION_MS,
  easing: FADE_EASING,
});
</script>
