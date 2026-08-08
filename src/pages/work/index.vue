<template>
  <view class="container page-safe-top">
    <view class="header">
      <text class="title">工作台</text>
    </view>

    <view class="card-layout">
      <view class="card card-banner" @click="openContractArchive">
        <svg
          class="card-banner-shape"
          viewBox="0 0 360 260"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#ffffff"
            d="M24 0
               H165
               C190 0 200 8 212 30
               C224 52 234 56 255 56
               H336
               C349.3 56 360 66.7 360 80
               V236
               C360 249.3 349.3 260 336 260
               H24
               C10.7 260 0 249.3 0 236
               V24
               C0 10.7 10.7 0 24 0
               Z"
          />
        </svg>
        <text class="card-banner-title">合同档案</text>
        <view class="card-banner-stat">
          <text class="card-banner-stat-label">合同数量</text>
          <text class="card-banner-stat-value">36</text>
        </view>
      </view>

      <view class="card-grid">
        <view class="card card-left">
          <view class="card-left-top">
            <view class="card-left-title">
              <text class="card-left-title-line">咨询</text>
              <text class="card-left-title-line">单</text>
            </view>
            <view class="card-left-add-btn">
              <image
                src="/static/icons/plus.svg"
                mode="aspectFit"
                class="card-left-add-icon"
              />
            </view>
          </view>
          <image
            src="/static/images/post1.png"
            mode="widthFix"
            class="card-left-img"
          />
        </view>

        <view class="card-right-col">
          <view class="card card-right-item card-approval">
            <view class="card-action-content">
              <image
                src="/static/icons/settings.svg"
                mode="aspectFit"
                class="card-action-icon card-action-icon-black"
              />
              <text class="card-action-text card-action-text-black">审批配置</text>
            </view>
          </view>
          <view class="card card-right-item card-bill">
            <view class="card-action-content">
              <image
                src="/static/icons/receipt.svg"
                mode="aspectFit"
                class="card-action-icon"
              />
              <text class="card-action-text card-action-text-green">账单管理</text>
            </view>
          </view>
          <view class="card card-right-item card-feedback">
            <view class="card-action-content">
              <image
                src="/static/icons/message-circle.svg"
                mode="aspectFit"
                class="card-action-icon card-action-icon-black"
              />
              <text class="card-action-text card-action-text-black">意见反馈</text>
            </view>
            <view class="card-feedback-add-btn" @click="onFeedbackAdd">
              <image
                src="/static/icons/plus.svg"
                mode="aspectFit"
                class="card-feedback-add-icon"
              />
            </view>
          </view>
        </view>
      </view>
    </view>

    <CustomTabBar currentPath="pages/work/index" />

    <SlideOverPanel :show="contractArchiveVisible" :z-index="1100">
      <ContractArchiveContent @back="closeContractArchive" />
    </SlideOverPanel>
  </view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
import CustomTabBar from '@/components/CustomTabBar.vue';
import SlideOverPanel from '@/components/SlideOverPanel.vue';
import ContractArchiveContent from '@/components/ContractArchiveContent.vue';
import { useSlideOver } from '@/composables/useSlideOver';

onShow(() => {
  uni.hideTabBar({ animation: false });
});

const {
  visible: contractArchiveVisible,
  open: openContractArchive,
  close: closeContractArchive,
} = useSlideOver();

const onFeedbackAdd = () => {
  // TODO: open feedback form
};
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
}

.card {
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.card-banner {
  height: 260px;
  position: relative;
  background-color: transparent;
  border-radius: 0;
  box-shadow: none;
  filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.05));
  overflow: visible;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 16px 18px 18px;
}

.card-banner-shape {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
  z-index: 0;
}

.card-banner-shape path {
  fill: #ffffff;
}

.card-banner-title {
  position: relative;
  z-index: 1;
  display: block;
  font-size: 30px;
  font-weight: 800;
  color: #163300;
  line-height: 1.12;
}

.card-banner-stat {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  margin-top: auto;
}

.card-banner-stat-label {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  line-height: 1.2;
  margin-bottom: 4px;
}

.card-banner-stat-value {
  font-size: 88px;
  font-weight: 800;
  color: #163300;
  line-height: 1;
}

.card-grid {
  display: flex;
  gap: 12px;
  align-items: stretch;
}

.card-left {
  flex: 1;
  min-height: 300px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.card-left-top {
  position: absolute;
  top: 10px;
  left: 16px;
  right: 10px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  z-index: 1;
}

.card-left-title {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}

.card-left-title-line {
  font-size: 30px;
  font-weight: 800;
  color: #163300;
  line-height: 1.12;
}

.card-left-add-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: -2px;
  margin-right: -2px;
}

.card-left-add-icon {
  width: 22px;
  height: 22px;
  filter: brightness(0) invert(1);
}

.card-left-img {
  width: 100%;
  transform: scale(1.45);
  transform-origin: bottom center;
}

.card-right-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-right-item {
  flex: 1;
  min-height: 0;
}

.card-bill {
  background-color: #9fe870;
}

.card-action-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  padding: 0 12px 0 18px;
}

.card-action-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

.card-action-icon-black {
  filter: brightness(0);
}

.card-action-text {
  font-size: 18px;
  font-weight: 800;
  line-height: 1.2;
  white-space: nowrap;
}

.card-action-text-black {
  color: #111827;
}

.card-action-text-green {
  color: #163300;
}

.card-feedback {
  position: relative;
  overflow: hidden;
}

.card-feedback-add-btn {
  position: absolute;
  top: 0;
  right: 0;
  width: 34px;
  height: 34px;
  background-color: #111827;
  border-radius: 0 24px 0 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.card-feedback-add-icon {
  width: 15px;
  height: 15px;
  filter: brightness(0) invert(1);
}
</style>
