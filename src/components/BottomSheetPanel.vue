<template>
  <Transition
    :name="BOTTOM_SHEET_TRANSITION_NAME"
    @after-leave="handleAfterLeave"
  >
    <view
      v-if="show"
      class="bottom-sheet-panel"
      :class="{ 'page-safe-top': !contentSafeTop }"
      :style="panelStyle"
    >
      <slot />
    </view>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  BOTTOM_SHEET_DURATION_MS,
  BOTTOM_SHEET_EASING,
  BOTTOM_SHEET_TRANSITION_NAME,
} from '@/utils/bottomSheetTransition';

const props = withDefaults(
  defineProps<{
    show: boolean;
    zIndex?: number;
    contentSafeTop?: boolean;
  }>(),
  {
    zIndex: 1000,
    contentSafeTop: false,
  },
);

const panelStyle = computed(() => ({
  zIndex: props.zIndex,
}));

const emit = defineEmits<{
  closed: [];
}>();

const handleAfterLeave = () => {
  emit('closed');
};

defineExpose({
  duration: BOTTOM_SHEET_DURATION_MS,
  easing: BOTTOM_SHEET_EASING,
});
</script>

<style>
/* 进入/退出：从屏幕底部滑入滑出 */
.bottom-sheet-enter-active,
.bottom-sheet-leave-active {
  transition: transform 420ms cubic-bezier(0.32, 0.72, 0, 1);
  will-change: transform;
}

.bottom-sheet-enter-from,
.bottom-sheet-leave-to {
  transform: translateY(100%);
}

.bottom-sheet-enter-to,
.bottom-sheet-leave-from {
  transform: translateY(0);
}

.bottom-sheet-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #F4F5F7;
  overflow-y: auto;
  box-sizing: border-box;
}
</style>
