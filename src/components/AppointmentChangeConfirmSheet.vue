<template>
  <view v-if="isRendered" class="change-sheet-root">
    <view class="change-sheet-mask" :class="{ closing: isClosing }" @click="handleClose" />
    <view class="change-sheet-panel" :class="{ closing: isClosing }">
      <SuccessPageTransition :show-success="showSuccess">
        <view class="change-sheet-page">
          <view class="change-sheet-header">
            <text class="change-sheet-title">确认变更时间</text>
            <view class="change-sheet-close" @click="handleClose">
              <image
                src="/static/icons/x.svg"
                mode="aspectFit"
                class="change-sheet-close-icon"
              />
            </view>
          </view>

          <view class="change-sheet-body">
            <text class="field-label">更改原因</text>
            <textarea
              v-model="reason"
              class="reason-textarea"
              placeholder="请输入更改原因"
              placeholder-class="reason-placeholder"
              :maxlength="200"
            />
            <view class="time-block">
              <text class="time-label">预约时间</text>
              <text class="time-value">{{ scheduledAt }}</text>
            </view>
          </view>

          <view class="change-sheet-footer">
            <view class="change-sheet-confirm" @click="handleConfirm">
              <text class="change-sheet-confirm-text">确认</text>
            </view>
          </view>
        </view>

        <template #success>
          <view class="change-sheet-page change-sheet-success">
            <view class="success-content">
              <image
                src="/static/images/check-mark.png"
                mode="aspectFit"
                class="success-icon"
              />
              <text class="success-title">确认成功</text>
              <text class="success-desc">变更时间已确认</text>
            </view>
            <view class="change-sheet-footer">
              <view class="change-sheet-done" @click="handleClose">
                <text class="change-sheet-done-text">完成</text>
              </view>
            </view>
          </view>
        </template>
      </SuccessPageTransition>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import SuccessPageTransition from '@/components/SuccessPageTransition.vue';

const props = defineProps<{
  show: boolean;
  showSuccess: boolean;
  scheduledAt: string;
  changeReason?: string;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();

const CLOSE_DURATION_MS = 320;

const reason = ref('');
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
      reason.value = props.changeReason ?? '';
      return;
    }

    if (isRendered.value && !isClosing.value) {
      startClose();
    }
  },
);

const handleClose = () => {
  startClose();
};

const handleConfirm = () => {
  if (props.showSuccess) return;
  emit('confirm');
};
</script>

<style scoped>
.change-sheet-root {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2450;
}

.change-sheet-mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(15, 23, 42, 0.45);
  animation: change-sheet-mask-in 320ms ease forwards;
}

.change-sheet-mask.closing {
  animation: change-sheet-mask-out 320ms ease forwards;
}

.change-sheet-panel {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 58vh;
  background-color: #ffffff;
  border-radius: 40rpx 40rpx 0 0;
  overflow: hidden;
  box-sizing: border-box;
  animation: change-sheet-slide-up 320ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.change-sheet-panel.closing {
  animation: change-sheet-slide-down 320ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.change-sheet-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.change-sheet-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 104rpx;
  flex-shrink: 0;
  border-bottom: 2rpx solid #f3f4f6;
}

.change-sheet-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

.change-sheet-close {
  position: absolute;
  right: 32rpx;
  top: 20rpx;
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.change-sheet-close-icon {
  width: 36rpx;
  height: 36rpx;
}

.change-sheet-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 32rpx 40rpx 8rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.field-label {
  display: block;
  font-size: 28rpx;
  color: #9ca3af;
  line-height: 1.2;
  margin-bottom: 16rpx;
}

.reason-textarea {
  width: 100%;
  min-height: 200rpx;
  padding: 24rpx 28rpx;
  background-color: #f9fafb;
  border: 2rpx solid #e5e7eb;
  border-radius: 24rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #111827;
  line-height: 1.55;
  box-sizing: border-box;
}

.reason-placeholder {
  color: #9ca3af;
  font-size: 28rpx;
}

.time-block {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.time-label {
  font-size: 28rpx;
  color: #9ca3af;
  line-height: 1.2;
  margin-bottom: 16rpx;
}

.time-value {
  font-size: 44rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.35;
}

.change-sheet-footer {
  flex-shrink: 0;
  padding: 24rpx 40rpx calc(24rpx + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
}

.change-sheet-confirm {
  height: 96rpx;
  border-radius: 48rpx;
  background-color: #9fe870;
  display: flex;
  align-items: center;
  justify-content: center;
}

.change-sheet-confirm-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #163300;
  line-height: 1;
}

.change-sheet-success {
  padding-top: 24rpx;
}

.success-content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 48rpx;
}

.success-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 32rpx;
  display: block;
}

.success-title {
  font-size: 40rpx;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 16rpx;
}

.success-desc {
  font-size: 28rpx;
  color: #6b7280;
  line-height: 1.5;
}

.change-sheet-done {
  height: 96rpx;
  border-radius: 48rpx;
  background-color: #ffffff;
  border: 2rpx solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.change-sheet-done-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

@keyframes change-sheet-slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes change-sheet-slide-down {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}

@keyframes change-sheet-mask-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes change-sheet-mask-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
