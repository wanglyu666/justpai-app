<template>
  <view
    v-if="rendered"
    class="bottom-sheet-panel"
    :class="[{ 'is-entered': entered }, { 'page-safe-top': !contentSafeTop }]"
    :style="panelStyle"
  >
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue';
import {
  BOTTOM_SHEET_DURATION_MS,
  BOTTOM_SHEET_EASING,
} from '@/utils/bottomSheetTransition';
import { waitFrames } from '@/utils/nextFrame';

const props = withDefaults(
  defineProps<{
    show: boolean;
    zIndex?: number;
    contentSafeTop?: boolean;
  }>(),
  {
    zIndex: 1200,
    contentSafeTop: false,
  },
);

const panelStyle = computed(() => ({
  zIndex: props.zIndex,
}));

const emit = defineEmits<{
  closed: [];
}>();

const rendered = ref(props.show);
const entered = ref(props.show);
let closeTimer: ReturnType<typeof setTimeout> | null = null;
let showSeq = 0;

const clearCloseTimer = () => {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
};

const finishClose = () => {
  clearCloseTimer();
  if (props.show) return;
  rendered.value = false;
  entered.value = false;
  emit('closed');
};

watch(
  () => props.show,
  async (show) => {
    const seq = ++showSeq;
    clearCloseTimer();

    if (show) {
      rendered.value = true;
      entered.value = false;
      await nextTick();
      await waitFrames(1);
      if (seq !== showSeq) return;
      entered.value = true;
      return;
    }

    entered.value = false;
    closeTimer = setTimeout(finishClose, BOTTOM_SHEET_DURATION_MS + 80);
  },
);

onUnmounted(() => {
  clearCloseTimer();
});

defineExpose({
  duration: BOTTOM_SHEET_DURATION_MS,
  easing: BOTTOM_SHEET_EASING,
});
</script>

<style>
.bottom-sheet-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f4f5f7;
  overflow-y: auto;
  box-sizing: border-box;
  transform: translateY(100%);
  transition: transform 420ms cubic-bezier(0.32, 0.72, 0, 1);
  will-change: transform;
}

.bottom-sheet-panel.is-entered {
  transform: translateY(0);
}
</style>
