<template>
  <view class="map-scene" :class="{ compact }">
    <view
      class="map-surface"
      :style="{
        transform: `translate3d(${shiftX * 6}rpx, ${shiftY * 6}rpx, 0)`,
      }"
    >
      <view class="road road-h road-h-1" />
      <view class="road road-h road-h-2" />
      <view class="road road-h road-h-3" />
      <view class="road road-v road-v-1" />
      <view class="road road-v road-v-2" />
      <view class="road road-v road-v-3" />
      <view class="block block-1" />
      <view class="block block-2" />
      <view class="block block-3" />
      <view class="block block-4" />
      <text class="map-label map-label-1">希里邮电所</text>
      <text class="map-label map-label-2">安线</text>
    </view>

    <view class="pin-stack">
      <view class="pin-accuracy" />
      <view class="pin-red" />
      <view class="pin-blue" />
    </view>

    <view v-if="label" class="pin-bubble">
      <text class="pin-bubble-text">{{ label }}</text>
    </view>

    <slot />
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string;
    compact?: boolean;
    shiftX?: number;
    shiftY?: number;
  }>(),
  {
    label: '',
    compact: false,
    shiftX: 0,
    shiftY: 0,
  },
);
</script>

<style scoped>
.map-scene {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #ececec;
}

.map-surface {
  position: absolute;
  inset: -18%;
  transition: transform 280ms ease;
}

.road {
  position: absolute;
  background-color: #f7f7f7;
}

.road-h {
  left: 0;
  right: 0;
  height: 18rpx;
}

.road-h-1 {
  top: 22%;
}

.road-h-2 {
  top: 48%;
  height: 28rpx;
  background-color: #fafafa;
}

.road-h-3 {
  top: 74%;
}

.road-v {
  top: 0;
  bottom: 0;
  width: 18rpx;
}

.road-v-1 {
  left: 28%;
}

.road-v-2 {
  left: 52%;
  width: 26rpx;
  background-color: #fafafa;
}

.road-v-3 {
  left: 76%;
}

.block {
  position: absolute;
  background-color: #e3e3e3;
  border: 2rpx solid #dedede;
}

.block-1 {
  left: 8%;
  top: 28%;
  width: 18%;
  height: 16%;
}

.block-2 {
  left: 58%;
  top: 8%;
  width: 16%;
  height: 12%;
}

.block-3 {
  left: 30%;
  top: 56%;
  width: 20%;
  height: 14%;
}

.block-4 {
  left: 78%;
  top: 52%;
  width: 14%;
  height: 18%;
}

.map-label {
  position: absolute;
  font-size: 20rpx;
  color: #b0b0b0;
  line-height: 1;
}

.map-label-1 {
  left: 6%;
  top: 18%;
}

.map-label-2 {
  right: 10%;
  bottom: 18%;
}

.compact .map-label {
  display: none;
}

.pin-stack {
  position: absolute;
  left: 50%;
  top: 46%;
  width: 0;
  height: 0;
  z-index: 2;
}

.pin-bubble {
  position: absolute;
  left: 50%;
  top: 26%;
  transform: translateX(-50%);
  z-index: 4;
  padding: 12rpx 20rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
  box-shadow: 0 8rpx 24rpx rgba(15, 23, 42, 0.12);
}

.pin-bubble-text {
  font-size: 24rpx;
  font-weight: 600;
  color: #111827;
  line-height: 1.2;
  white-space: nowrap;
}

.compact .pin-bubble {
  top: 18%;
  padding: 8rpx 16rpx;
}

.compact .pin-bubble-text {
  font-size: 22rpx;
}

.pin-accuracy {
  position: absolute;
  left: 50%;
  top: 8rpx;
  width: 120rpx;
  height: 120rpx;
  margin-left: -60rpx;
  margin-top: -20rpx;
  border-radius: 50%;
  background-color: rgba(59, 130, 246, 0.16);
}

.compact .pin-accuracy {
  width: 88rpx;
  height: 88rpx;
  margin-left: -44rpx;
  margin-top: -16rpx;
}

.pin-red {
  position: absolute;
  left: 50%;
  bottom: 28rpx;
  width: 28rpx;
  height: 28rpx;
  margin-left: -14rpx;
  border-radius: 50%;
  background-color: #ef4444;
  border: 4rpx solid #ffffff;
  box-shadow: 0 6rpx 12rpx rgba(239, 68, 68, 0.35);
  z-index: 2;
}

.compact .pin-red {
  width: 22rpx;
  height: 22rpx;
  margin-left: -11rpx;
  bottom: 22rpx;
}

.pin-blue {
  position: absolute;
  left: 50%;
  top: 18rpx;
  width: 28rpx;
  height: 28rpx;
  margin-left: -14rpx;
  border-radius: 50%;
  background-color: #3b82f6;
  border: 6rpx solid #ffffff;
  box-shadow: 0 4rpx 10rpx rgba(59, 130, 246, 0.28);
  z-index: 2;
}

.compact .pin-blue {
  width: 22rpx;
  height: 22rpx;
  margin-left: -11rpx;
  border-width: 5rpx;
  top: 12rpx;
}
</style>
