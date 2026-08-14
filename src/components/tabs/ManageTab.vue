<template>
  <view class="tab-root">
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
          <image
            class="wallet-front-shape"
            src="/static/images/work-card/wallet-front.png"
            mode="scaleToFill"
          />
          <view class="wallet-balance">
            <text class="wallet-amount">$120,000</text>
            <text class="wallet-label">Total Balance</text>
          </view>
        </view>
      </view>
    </view>
    </view>
  </view>
</template>

<script setup lang="ts"></script>

<style scoped>
.tab-root {
  height: 100%;
}

.container {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
}

.header {
  padding: 0 48rpx;
  margin-bottom: 56rpx;
}

.title {
  display: block;
  font-size: 56rpx;
  font-weight: 900;
  color: #111827;
}

.card-layout {
  padding: 0 48rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  min-height: calc(100vh - var(--page-safe-top) - 360rpx);
}

.card {
  background-color: #ffffff;
  border-radius: 48rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.04);
}

.card-top {
  height: 280rpx;
  flex-shrink: 0;
}

.card-middle {
  height: 240rpx;
  flex-shrink: 0;
}

.card-bottom {
  flex: 1;
  min-height: 600rpx;
}

.wallet-stack {
  position: relative;
  overflow: hidden;
  background-color: #1a1a1a;
  border: 6rpx solid #2a2a2a;
  padding: 0;
  box-sizing: border-box;
}

.wallet-layer {
  position: absolute;
  left: 24rpx;
  right: 24rpx;
  height: 176rpx;
  border-radius: 36rpx;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 32rpx 36rpx 0;
  box-sizing: border-box;
}

.wallet-visa {
  top: 24rpx;
  background-color: #1a1f71;
  z-index: 1;
}

.wallet-stripe {
  top: 120rpx;
  background-color: #635bff;
  z-index: 2;
}

.wallet-paypal {
  top: 216rpx;
  background-color: #ffffff;
  z-index: 3;
}

.wallet-brand {
  font-size: 30rpx;
  font-weight: 700;
  line-height: 1;
}

.wallet-brand-visa {
  color: #ffffff;
  letter-spacing: 2rpx;
}

.wallet-brand-stripe {
  color: #ffffff;
  letter-spacing: 0.4rpx;
}

.wallet-brand-paypal {
  color: #003087;
}

.wallet-front {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 312rpx;
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
  left: 44rpx;
  bottom: 44rpx;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

.wallet-amount {
  font-size: 72rpx;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.1;
  letter-spacing: -1rpx;
}

.wallet-label {
  margin-top: 12rpx;
  font-size: 26rpx;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.2;
}
</style>
