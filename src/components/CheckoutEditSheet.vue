<template>
  <view v-if="isRendered" class="edit-sheet-root">
    <view class="edit-sheet-mask" :class="{ closing: isClosing }" @click="handleClose" />
    <view class="edit-sheet-panel" :class="{ closing: isClosing }">
      <view class="edit-sheet-header">
        <text class="edit-sheet-title">{{ title }}</text>
        <view class="edit-sheet-close" @click="handleClose">
          <text class="edit-sheet-close-text">×</text>
        </view>
      </view>

      <view class="edit-sheet-body">
        <slot />
      </view>

      <view class="edit-sheet-footer">
        <view class="edit-sheet-confirm" @click="handleConfirm">
          <text class="edit-sheet-confirm-text">确定</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  show: boolean;
  title: string;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();

const CLOSE_DURATION_MS = 320;

const isRendered = ref(false);
const isClosing = ref(false);
let closeTimer: ReturnType<typeof setTimeout> | null = null;

const clearCloseTimer = () => {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
};

const startClose = (event: 'close' | 'confirm') => {
  if (isClosing.value) return;

  isClosing.value = true;
  clearCloseTimer();
  closeTimer = setTimeout(() => {
    isRendered.value = false;
    isClosing.value = false;
    closeTimer = null;
    emit(event);
  }, CLOSE_DURATION_MS);
};

watch(
  () => props.show,
  (visible) => {
    if (visible) {
      clearCloseTimer();
      isRendered.value = true;
      isClosing.value = false;
      return;
    }

    if (isRendered.value) {
      startClose('close');
    }
  },
);

const handleClose = () => {
  startClose('close');
};

const handleConfirm = () => {
  startClose('confirm');
};
</script>

<style scoped>
.edit-sheet-root {
  position: fixed;
  inset: 0;
  z-index: 1400;
}

.edit-sheet-mask {
  position: absolute;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.45);
  opacity: 1;
  animation: edit-sheet-mask-in 320ms ease forwards;
}

.edit-sheet-mask.closing {
  animation: edit-sheet-mask-out 320ms ease forwards;
}

.edit-sheet-panel {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  max-height: 58vh;
  min-height: 42vh;
  background-color: #ffffff;
  border-radius: 40rpx 40rpx 0 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  animation: edit-sheet-slide-up 320ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.edit-sheet-panel.closing {
  animation: edit-sheet-slide-down 320ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.edit-sheet-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 104rpx;
  flex-shrink: 0;
  border-bottom: 2rpx solid #f3f4f6;
}

.edit-sheet-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

.edit-sheet-close {
  position: absolute;
  right: 32rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-sheet-close-text {
  font-size: 48rpx;
  line-height: 1;
  color: #9ca3af;
}

.edit-sheet-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 32rpx 40rpx;
  box-sizing: border-box;
}

.edit-sheet-footer {
  flex-shrink: 0;
  padding: 24rpx 40rpx calc(24rpx + env(safe-area-inset-bottom, 0px));
  border-top: 2rpx solid #f3f4f6;
  box-sizing: border-box;
}

.edit-sheet-confirm {
  height: 96rpx;
  border-radius: 48rpx;
  background-color: #9fe870;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-sheet-confirm-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #163300;
  line-height: 1;
}

@keyframes edit-sheet-slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes edit-sheet-slide-down {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}

@keyframes edit-sheet-mask-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes edit-sheet-mask-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
