<template>
  <view class="container page-safe-top">
    <view class="header">
      <text class="title">管理</text>
    </view>

    <view class="card-layout">
      <view class="card card-top"></view>
      <view class="card card-middle"></view>

      <view class="card card-bottom wallet-stack">
        <view class="wallet-layer wallet-visa">
          <text class="wallet-brand wallet-brand-visa">VISA</text>
        </view>
        <view class="wallet-layer wallet-stripe">
          <text class="wallet-brand wallet-brand-stripe">stripe</text>
        </view>
        <view class="wallet-layer wallet-paypal">
          <text class="wallet-brand wallet-brand-paypal">PayPal</text>
        </view>
        <view class="wallet-front">
          <svg
            class="wallet-front-shape"
            viewBox="0 0 360 220"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#111111"
              d="M0 52
                 H48
                 L92 14
                 Q96 10 102 10
                 H258
                 Q264 10 268 14
                 L312 52
                 H360
                 V196
                 Q360 220 336 220
                 H24
                 Q0 220 0 196
                 Z"
            />
          </svg>
          <view class="wallet-balance">
            <text class="wallet-amount">$120,000</text>
            <text class="wallet-label">Total Balance</text>
          </view>
        </view>
      </view>
    </view>

    <CustomTabBar currentPath="pages/manage/index" />
  </view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
import CustomTabBar from '@/components/CustomTabBar.vue';

onShow(() => {
  uni.hideTabBar({ animation: false });
});
</script>

<style scoped>
.header {
  padding: 0 24px;
  margin-bottom: 28px;
}

.title {
  display: block;
  font-size: 28px;
  font-weight: 900;
  color: #111827;
}

.card-layout {
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: calc(100vh - var(--page-safe-top) - 180px);
}

.card {
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.card-top {
  height: 140px;
  flex-shrink: 0;
}

.card-middle {
  height: 120px;
  flex-shrink: 0;
}

.card-bottom {
  flex: 1;
  min-height: 300px;
}

.wallet-stack {
  position: relative;
  overflow: hidden;
  background-color: #1a1a1a;
  border: 3px solid #2a2a2a;
  padding: 0;
  box-sizing: border-box;
}

.wallet-layer {
  position: absolute;
  left: 12px;
  right: 12px;
  height: 88px;
  border-radius: 18px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 16px 18px 0;
  box-sizing: border-box;
}

.wallet-visa {
  top: 12px;
  background-color: #1a1f71;
  z-index: 1;
}

.wallet-stripe {
  top: 60px;
  background-color: #635bff;
  z-index: 2;
}

.wallet-paypal {
  top: 108px;
  background-color: #ffffff;
  z-index: 3;
}

.wallet-brand {
  font-size: 15px;
  font-weight: 700;
  line-height: 1;
}

.wallet-brand-visa {
  color: #ffffff;
  letter-spacing: 1px;
}

.wallet-brand-stripe {
  color: #ffffff;
  letter-spacing: 0.2px;
}

.wallet-brand-paypal {
  color: #003087;
}

.wallet-front {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 156px;
  z-index: 4;
}

.wallet-front-shape {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}

.wallet-balance {
  position: absolute;
  left: 22px;
  bottom: 22px;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

.wallet-amount {
  font-size: 36px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.1;
  letter-spacing: -0.5px;
}

.wallet-label {
  margin-top: 6px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.2;
}
</style>
