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

      <view class="card card-bottom">
        <text class="card-bottom-label">咨询与反馈</text>
        <view class="card-bottom-actions">
          <view class="card-bottom-btn card-bottom-btn-light">
            <text class="card-bottom-btn-text">咨询单</text>
          </view>
          <view class="card-bottom-btn card-bottom-btn-solid">
            <text class="card-bottom-btn-text">意见反馈</text>
          </view>
        </view>
        <image
          src="/static/images/post1.png"
          mode="heightFix"
          class="card-bottom-img"
        />
      </view>
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
  position: relative;
  height: 160px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.card-bottom-label {
  position: absolute;
  top: 14px;
  right: 24px;
  font-size: 20px;
  font-weight: 700;
  color: #163300;
  z-index: 1;
}
.card-bottom-actions {
  position: absolute;
  right: 24px;
  bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1;
}
.card-bottom-btn {
  height: 34px;
  padding: 0 16px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-bottom-btn-light {
  background-color: rgba(159, 232, 112, 0.7);
}
.card-bottom-btn-solid {
  background-color: #9fe870;
}
.card-bottom-btn-text {
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
  color: #163300;
}
.card-bottom-img {
  height: 100%;
  max-width: 100%;
}
</style>
