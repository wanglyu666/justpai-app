<template>
  <view
    v-if="rendered"
    class="slide-over-panel"
    :class="{ 'is-entered': entered }"
    :style="panelStyle"
  >
    <view
      class="slide-over-scroll"
      :class="edgeToEdge ? 'slide-over-edge' : 'page-safe-top'"
    >
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue';
import {
  SLIDE_OVER_DURATION_MS,
  SLIDE_OVER_EASING,
} from '@/utils/slideOverTransition';
import { waitFrames } from '@/utils/nextFrame';
import { SECONDARY_PAGE_Z_INDEX } from '@/utils/pageFadeTransition';
import { registerSecondaryPage } from '@/composables/useSecondaryPage';

const props = withDefaults(
  defineProps<{
    show: boolean;
    zIndex?: number;
    edgeToEdge?: boolean;
  }>(),
  {
    zIndex: SECONDARY_PAGE_Z_INDEX,
    edgeToEdge: false,
  },
);

const panelStyle = computed(() => ({
  zIndex: props.zIndex,
}));

const emit = defineEmits<{
  closed: [];
}>();

/** 不用 Vue Transition：App 端 leave 常卡住导致关不掉；改用 class + 超时兜底 */
const rendered = ref(props.show);
const entered = ref(props.show);
registerSecondaryPage(rendered);
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
    // App 上 transitionend 不可靠，超时后强制卸载
    closeTimer = setTimeout(finishClose, SLIDE_OVER_DURATION_MS + 80);
  },
);

onUnmounted(() => {
  clearCloseTimer();
});

defineExpose({
  duration: SLIDE_OVER_DURATION_MS,
  easing: SLIDE_OVER_EASING,
});
</script>

<style>
.slide-over-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  background-color: #f4f5f7;
  overflow: hidden;
  box-sizing: border-box;
  transform: translateX(100%);
  transition: transform 420ms cubic-bezier(0.32, 0.72, 0, 1);
  will-change: transform;
}

.slide-over-panel.is-entered {
  transform: translateX(0);
}

/* 滚动放在内层，外层固定铺底色，弹性越界时仍显示面板背景而不露出底层 */
.slide-over-scroll {
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
  background-color: #f4f5f7;
  box-sizing: border-box;
}

.slide-over-edge {
  padding-top: calc(16rpx + env(safe-area-inset-top, 0px));
}
</style>
