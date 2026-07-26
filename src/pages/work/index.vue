<template>
  <view class="container page-safe-top">
    <view class="header">
      <text class="title">工作台</text>
    </view>

    <view class="card-layout">
      <view class="card card-top"></view>

      <view class="card-row">
        <view class="card card-half"></view>
        <view class="card card-half"></view>
      </view>

      <view class="card card-bottom"></view>
    </view>

    <CustomTabBar currentPath="pages/work/index" />
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
  gap: 16px;
}
.card {
  background-color: #ffffff;
  border-radius: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}
.card-top {
  height: 220px;
}
.card-row {
  display: flex;
  gap: 16px;
}
.card-half {
  flex: 1;
  height: 170px;
}
.card-bottom {
  height: 160px;
}
</style>
