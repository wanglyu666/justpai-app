<template>
  <view class="container page-safe-top empty-state">
    <image src="/static/icons/users.svg" mode="aspectFit" style="width: 48px; height: 48px; margin-bottom: 16px;"></image>
    <text class="empty-text">功能开发中...</text>
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
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
.empty-text {
  font-size: 14px;
  color: #9ca3af;
  font-weight: 500;
}
</style>
