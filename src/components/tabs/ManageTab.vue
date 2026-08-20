<template>
  <view class="tab-root">
  <view class="container page-safe-top">
    <view class="header">
      <text class="title">管理</text>
    </view>

    <view class="card-layout">
      <view class="card card-top">
        <text class="card-top-title">工程项目管理</text>
        <image
          class="card-top-img"
          src="/static/images/wrench.png"
          mode="aspectFit"
        />
      </view>
      <view class="card card-middle"></view>

      <view class="card card-bottom wallet-stack">
        <view class="wallet-layer wallet-visa">
          <text class="wallet-brand wallet-brand-visa">待开工</text>
        </view>
        <view class="wallet-layer wallet-stripe">
          <text class="wallet-brand wallet-brand-stripe">施工中</text>
        </view>
        <view class="wallet-layer wallet-paypal">
          <text class="wallet-brand wallet-brand-paypal">已完工</text>
        </view>
        <view class="wallet-front">
          <image
            class="wallet-front-shape"
            src="/static/images/work-card/wallet-front.png?v=2"
            mode="scaleToFill"
          />
          <view class="wallet-balance">
            <text class="wallet-amount">维保项目管理</text>
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
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  padding: 40rpx 36rpx;
}

.card-top-title {
  position: relative;
  z-index: 1;
  display: block;
  font-size: 40rpx;
  font-weight: 800;
  color: #1a2332;
  line-height: 1.2;
}

.card-top-img {
  position: absolute;
  right: 8rpx;
  bottom: -16rpx;
  width: 220rpx;
  height: 280rpx;
  z-index: 0;
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
  background-color: #b2c4d7;
  border: 6rpx solid #b2c4d7;
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
  background-color: #000000;
  z-index: 1;
}

.wallet-stripe {
  top: 120rpx;
  background-color: #9fe870;
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
}

.wallet-brand-stripe {
  color: #163300;
}

.wallet-brand-paypal {
  color: #111827;
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
  color: #1a2332;
  line-height: 1.1;
  letter-spacing: -1rpx;
}
</style>
