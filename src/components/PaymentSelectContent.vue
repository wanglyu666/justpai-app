<template>
  <view class="payment-page">
    <view class="payment-body">
      <view class="payment-center">
        <text class="payment-title">请选择支付方式</text>

        <view class="payment-grid">
          <view class="payment-row payment-row-top">
            <view
              v-for="method in topMethods"
              :key="method.id"
              class="payment-block"
              :class="{ active: selectedMethod === method.id }"
              @click="selectMethod(method.id)"
            >
              <image :src="method.image" mode="aspectFit" class="payment-image" />
            </view>
          </view>

          <view class="payment-row payment-row-bottom">
            <view
              class="payment-block"
              :class="{ active: selectedMethod === bottomMethod.id }"
              @click="selectMethod(bottomMethod.id)"
            >
              <image :src="bottomMethod.image" mode="aspectFit" class="payment-image" />
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="payment-footer">
      <view
        class="payment-confirm"
        :class="{ active: selectedMethod !== null }"
        @click="handleConfirm"
      >
        <text class="payment-confirm-text">确认</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

export type PaymentMethodId = 'unionpay' | 'wechat' | 'alipay';

type PaymentMethod = {
  id: PaymentMethodId;
  image: string;
};

const topMethods: PaymentMethod[] = [
  { id: 'unionpay', image: '/static/images/unionpay.png' },
  { id: 'wechat', image: '/static/images/wechatpay.png' },
];

const bottomMethod: PaymentMethod = {
  id: 'alipay',
  image: '/static/images/alipay.png',
};

const emit = defineEmits<{
  confirm: [method: PaymentMethodId];
}>();

const selectedMethod = ref<PaymentMethodId | null>(null);

const selectMethod = (id: PaymentMethodId) => {
  selectedMethod.value = id;
};

const handleConfirm = () => {
  if (!selectedMethod.value) return;
  emit('confirm', selectedMethod.value);
};
</script>

<style scoped>
.payment-page {
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: #f4f5f7;
}

.payment-body {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48rpx;
  box-sizing: border-box;
}

.payment-center {
  width: 100%;
  max-width: 640rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.payment-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.4;
  margin-bottom: 56rpx;
  text-align: center;
}

.payment-grid {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32rpx;
}

.payment-row-top {
  display: flex;
  gap: 32rpx;
  width: 100%;
  justify-content: center;
}

.payment-row-bottom {
  display: flex;
  justify-content: center;
  width: 100%;
}

.payment-block {
  width: 264rpx;
  height: 192rpx;
  border-radius: 36rpx;
  background-color: #ffffff;
  border: 2rpx solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28rpx;
  box-sizing: border-box;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.payment-block.active {
  border-color: #9fe870;
  background-color: #f0fdf4;
}

.payment-image {
  width: 100%;
  height: 100%;
}

.payment-footer {
  flex-shrink: 0;
  padding: 24rpx 48rpx calc(24rpx + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
}

.payment-confirm {
  height: 96rpx;
  border-radius: 48rpx;
  background-color: rgba(159, 232, 112, 0.38);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.payment-confirm.active {
  background-color: #9fe870;
}

.payment-confirm-text {
  font-size: 32rpx;
  font-weight: 700;
  color: rgba(22, 51, 0, 0.45);
  line-height: 1;
  transition: color 0.2s ease;
}

.payment-confirm.active .payment-confirm-text {
  color: #163300;
}
</style>
