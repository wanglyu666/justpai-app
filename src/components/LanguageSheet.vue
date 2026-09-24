<template>
  <view v-if="isRendered" class="language-sheet-root">
    <view class="language-sheet-mask" :class="{ closing: isClosing }" @click="handleClose" />
    <view class="language-sheet-panel" :class="{ closing: isClosing }">
      <view class="language-sheet-header">
        <text class="language-sheet-title">{{ title }}</text>
        <view class="language-sheet-close" @click="handleClose">
          <text class="language-sheet-close-text">×</text>
        </view>
      </view>

      <view class="language-sheet-list">
        <view
          v-for="option in options"
          :key="option.code"
          class="language-option"
          :class="option.code === current ? 'is-active' : ''"
          @click="handleSelect(option.code)"
        >
          <text class="language-option-label">{{ option.label }}</text>
          <image
            v-if="option.code === current"
            src="/static/icons/check.svg"
            mode="aspectFit"
            class="language-option-check"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { AppLanguage } from '@/locales/languagePatch';

const props = defineProps<{
  show: boolean;
  title: string;
  current: AppLanguage;
  options: Array<{ code: AppLanguage; label: string }>;
}>();

const emit = defineEmits<{
  close: [];
  select: [code: AppLanguage];
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

const startClose = () => {
  if (isClosing.value) return;
  isClosing.value = true;
  clearCloseTimer();
  closeTimer = setTimeout(() => {
    isRendered.value = false;
    isClosing.value = false;
    closeTimer = null;
    emit('close');
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

    if (isRendered.value && !isClosing.value) {
      startClose();
    }
  },
);

const handleClose = () => {
  if (!props.show || isClosing.value) return;
  startClose();
};

const handleSelect = (code: AppLanguage) => {
  if (isClosing.value) return;
  emit('select', code);
};
</script>

<style scoped>
.language-sheet-root {
  position: fixed;
  inset: 0;
  z-index: 2600;
}

.language-sheet-mask {
  position: absolute;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.45);
  animation: language-sheet-mask-in 320ms ease forwards;
}

.language-sheet-mask.closing {
  animation: language-sheet-mask-out 320ms ease forwards;
}

.language-sheet-panel {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  border-radius: 40rpx 40rpx 0 0;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
  animation: language-sheet-slide-up 320ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.language-sheet-panel.closing {
  animation: language-sheet-slide-down 320ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.language-sheet-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 112rpx;
}

.language-sheet-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

.language-sheet-close {
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

.language-sheet-close-text {
  font-size: 48rpx;
  line-height: 1;
  color: #9ca3af;
}

.language-sheet-list {
  padding: 8rpx 32rpx 16rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.language-option {
  min-height: 104rpx;
  padding: 0 32rpx;
  border-radius: 28rpx;
  background-color: #f4f5f7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.language-option.is-active {
  background-color: #f3fbe8;
}

.language-option-label {
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
}

.language-option-check {
  width: 40rpx;
  height: 40rpx;
  flex-shrink: 0;
}

@keyframes language-sheet-mask-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes language-sheet-mask-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes language-sheet-slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes language-sheet-slide-down {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}
</style>
