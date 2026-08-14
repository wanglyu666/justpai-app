<template>
  <view v-if="isRendered" class="purchase-sheet-root">
    <view class="purchase-sheet-mask" :class="{ closing: isClosing }" @click="handleClose" />
    <view class="purchase-sheet-panel" :class="{ closing: isClosing }">
      <view class="purchase-sheet-header">
        <text class="purchase-sheet-title">确认信息</text>
        <view class="purchase-sheet-close" @click="handleClose">
          <text class="purchase-sheet-close-text">×</text>
        </view>
      </view>

      <view class="purchase-sheet-body">
        <view class="purchase-message-wrap">
          <text class="purchase-message-text">
            您好，根据这么派平台规则中订单支付的规则，您的订单已优享先服务后支付的优惠政策。您可根据流程亲自创建产品采购单或由平台协助创建，创建完成后，请前往合同管理中「签约管理」进行签约确认，给您带来的不便敬请谅解，如有其它问题请您拨打客服热线
            <text class="purchase-hotline">400-688-1997</text>
          </text>
        </view>
      </view>

      <view class="purchase-sheet-footer">
        <view class="purchase-action purchase-action-primary" @click="handleEngineerCreate">
          <text class="purchase-action-text purchase-action-text-light">专属工程师创建</text>
        </view>
        <view class="purchase-action purchase-action-secondary" @click="handleSelfCreate">
          <text class="purchase-action-text">亲自创建</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

export type PurchasePayConfirmAction = 'engineer' | 'self';

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [action: PurchasePayConfirmAction];
}>();

const CLOSE_DURATION_MS = 320;

const isRendered = ref(false);
const isClosing = ref(false);
let closeTimer: ReturnType<typeof setTimeout> | null = null;
let pendingAction: PurchasePayConfirmAction | null = null;

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
    if (event === 'confirm' && pendingAction) {
      emit('confirm', pendingAction);
      pendingAction = null;
    } else {
      pendingAction = null;
      emit('close');
    }
  }, CLOSE_DURATION_MS);
};

watch(
  () => props.show,
  (visible) => {
    if (visible) {
      clearCloseTimer();
      isRendered.value = true;
      isClosing.value = false;
      pendingAction = null;
      return;
    }

    if (isRendered.value && !isClosing.value) {
      startClose('close');
    }
  },
);

const handleClose = () => {
  startClose('close');
};

const handleEngineerCreate = () => {
  pendingAction = 'engineer';
  startClose('confirm');
};

const handleSelfCreate = () => {
  pendingAction = 'self';
  startClose('confirm');
};
</script>

<style scoped>
.purchase-sheet-root {
  position: fixed;
  inset: 0;
  z-index: 1500;
}

.purchase-sheet-mask {
  position: absolute;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.45);
  animation: purchase-sheet-mask-in 320ms ease forwards;
}

.purchase-sheet-mask.closing {
  animation: purchase-sheet-mask-out 320ms ease forwards;
}

.purchase-sheet-panel {
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
  animation: purchase-sheet-slide-up 320ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.purchase-sheet-panel.closing {
  animation: purchase-sheet-slide-down 320ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.purchase-sheet-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 104rpx;
  flex-shrink: 0;
  border-bottom: 2rpx solid #f3f4f6;
}

.purchase-sheet-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

.purchase-sheet-close {
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

.purchase-sheet-close-text {
  font-size: 48rpx;
  line-height: 1;
  color: #9ca3af;
}

.purchase-sheet-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 32rpx 40rpx;
  box-sizing: border-box;
}

.purchase-message-wrap {
  min-height: 320rpx;
  padding: 28rpx 28rpx 28rpx;
  border-radius: 24rpx;
  background-color: #f9fafb;
  border: 2rpx solid #e5e7eb;
  box-sizing: border-box;
}

.purchase-message-text {
  display: block;
  font-size: 28rpx;
  color: #374151;
  line-height: 1.6;
}

.purchase-hotline {
  color: #9fe870;
  font-weight: 700;
}

.purchase-sheet-footer {
  flex-shrink: 0;
  padding: 24rpx 40rpx calc(24rpx + env(safe-area-inset-bottom, 0px));
  border-top: 2rpx solid #f3f4f6;
  display: flex;
  gap: 24rpx;
  box-sizing: border-box;
}

.purchase-action {
  flex: 1;
  min-width: 0;
  height: 96rpx;
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.purchase-action-primary {
  background-color: #9fe870;
}

.purchase-action-secondary {
  background-color: #ffffff;
  border: 2rpx solid #e5e7eb;
}

.purchase-action-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

.purchase-action-text-light {
  color: #163300;
}

@keyframes purchase-sheet-slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes purchase-sheet-slide-down {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}

@keyframes purchase-sheet-mask-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes purchase-sheet-mask-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
