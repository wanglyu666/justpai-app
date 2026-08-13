<template>
  <Transition
    :name="MODAL_TRANSITION_NAME"
    :duration="MODAL_DURATION_MS"
    @after-leave="handleAfterLeave"
  >
    <view v-if="show" class="modal-root" @click="handleMaskClick">
      <view class="modal-dim frosted-overlay" :style="overlayStyle"></view>
      <view class="modal-panel" :class="{ 'modal-panel-compact': compact }" @click.stop>
        <view class="modal-glass frosted-glass frosted-glass--modal-panel" :style="glassStyle"></view>
        <view class="modal-content" :class="{ 'modal-content-compact': compact }">
          <view class="modal-body" :class="{ 'modal-body-compact': compact }">
            <image
              v-if="icon"
              :src="icon"
              mode="aspectFit"
              class="modal-icon"
              :class="{ 'modal-icon-large': compact }"
            />
            <text class="modal-title">{{ title }}</text>
            <text v-if="message" class="modal-message">{{ message }}</text>
          </view>

          <view v-if="showCancel || showConfirm" class="modal-actions">
            <view v-if="showCancel" class="cancel-btn" @click="handleCancel">
              <text class="cancel-btn-text">{{ cancelText }}</text>
            </view>
            <view
              v-if="showConfirm"
              class="confirm-btn"
              :class="{ 'confirm-btn-success': tone === 'success' }"
              @click="handleConfirm"
            >
              <text class="confirm-btn-text" :class="{ 'confirm-btn-text-success': tone === 'success' }">{{ confirmText }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </Transition>
</template>

<script setup lang="ts">
import {
  MODAL_DURATION_MS,
  MODAL_EASING,
  MODAL_TRANSITION_NAME,
} from '@/utils/modalTransition';
import { getFrostedGlassStyle, getFrostedOverlayStyle } from '@/utils/frostedGlass';

const glassStyle = getFrostedGlassStyle('modalPanel');
const overlayStyle = getFrostedOverlayStyle();

const props = withDefaults(
  defineProps<{
    show: boolean;
    title?: string;
    message?: string;
    icon?: string;
    cancelText?: string;
    confirmText?: string;
    showCancel?: boolean;
    showConfirm?: boolean;
    tone?: 'danger' | 'success';
    compact?: boolean;
    closeOnMask?: boolean;
  }>(),
  {
    title: '确认删除',
    message: '',
    icon: '',
    cancelText: '取消',
    confirmText: '确认',
    showCancel: true,
    showConfirm: true,
    tone: 'danger',
    compact: false,
    closeOnMask: true,
  },
);

const emit = defineEmits<{
  cancel: [];
  confirm: [];
  closed: [];
}>();

const handleCancel = () => {
  emit('cancel');
};

const handleConfirm = () => {
  emit('confirm');
};

const handleMaskClick = () => {
  if (!props.closeOnMask) return;
  emit('cancel');
};

const handleAfterLeave = () => {
  emit('closed');
};

defineExpose({
  duration: MODAL_DURATION_MS,
  easing: MODAL_EASING,
});
</script>

<style>
/* 仅用透明度过渡，避免 transform 破坏 backdrop-filter */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 280ms cubic-bezier(0.32, 0.72, 0, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
}

.modal-root {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 40px;
  box-sizing: border-box;
}

.modal-dim {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.modal-panel {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 320px;
  border-radius: 24px;
  overflow: hidden;
}

.modal-panel-compact {
  max-width: 260px;
}

.modal-glass {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 24px;
  box-sizing: border-box;
  pointer-events: none;
}

.modal-content {
  position: relative;
  z-index: 1;
  padding: 28px 20px 20px;
  box-sizing: border-box;
}

.modal-content-compact {
  padding: 22px 16px 16px;
}

.modal-body {
  padding: 8px 8px 28px;
  text-align: center;
}

.modal-body-compact {
  padding: 4px 4px 8px;
}

.modal-icon {
  width: 88px;
  height: 88px;
  margin: 0 auto 16px;
  display: block;
}

.modal-icon-large {
  width: 120px;
  height: 120px;
  margin-bottom: 12px;
}

.modal-title {
  display: block;
  width: 100%;
  text-align: center;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.4;
}

.modal-message {
  display: block;
  width: 100%;
  text-align: center;
  margin-top: 8px;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cancel-btn {
  height: 48px;
  border-radius: 24px;
  background-color: rgba(229, 231, 235, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cancel-btn-text {
  font-size: 16px;
  font-weight: 700;
  color: #374151;
}

.confirm-btn {
  height: 48px;
  border-radius: 24px;
  background-color: #ff3b30;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-btn-success {
  background-color: #9fe870;
}

.confirm-btn-text {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
}

.confirm-btn-text-success {
  color: #163300;
}
</style>
