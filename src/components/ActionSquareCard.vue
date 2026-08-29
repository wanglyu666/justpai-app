<template>
  <view class="action-square" hover-class="none" @click="emit('click')">
    <image class="action-square-icon" :src="icon" mode="aspectFit" />
    <text class="action-square-text">{{ label }}</text>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
  label: string;
}>();

const emit = defineEmits<{
  click: [];
}>();
</script>

<style>
.action-square {
  flex: 1;
  aspect-ratio: 1 / 1;
  min-height: 280rpx;
  border-radius: 40rpx;
  background-color: #ffffff;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  box-sizing: border-box;
  padding: 24rpx;
}

.action-square-icon {
  width: 56rpx;
  height: 56rpx;
  flex-shrink: 0;
}

.action-square-text {
  font-size: 28rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
  text-align: center;
}
</style>
