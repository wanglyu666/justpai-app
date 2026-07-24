<template>
  <view class="container">
    <view class="header">
      <text class="title">工作台</text>
      <text class="subtitle">管理您的业务与组织架构</text>
    </view>
    
    <view class="grid-container">
      <!-- Card 1: 合同档案 -->
      <view class="card normal-card">
        <view class="decor decor-blue"></view>
        <view class="icon-box bg-blue">
          <image src="/static/icons/file-text.svg" mode="aspectFit" style="width: 20px; height: 20px;"></image>
        </view>
        <text class="card-title">合同档案</text>
        <text class="card-desc">管理与查看所有合同文件</text>
      </view>

      <!-- Card 2: 组织与架构 - 审批配置 -->
      <view class="card normal-card row-span-2">
        <view class="decor decor-purple"></view>
        <view class="icon-box bg-purple">
          <image src="/static/icons/settings.svg" mode="aspectFit" style="width: 20px; height: 20px;"></image>
        </view>
        <text class="card-tag">组织与架构</text>
        <text class="card-title">审批配置</text>
        <text class="card-desc">自定义审批流程与权限</text>
      </view>

      <!-- Card 3: 账单管理 -->
      <view class="card highlight-card">
        <view class="decor decor-green"></view>
        <view class="icon-box bg-green-light">
          <image src="/static/icons/receipt.svg" mode="aspectFit" style="width: 20px; height: 20px;"></image>
        </view>
        <text class="card-title text-green">账单管理</text>
        <text class="card-desc text-green-sub">企业账单与发票明细</text>
      </view>

      <!-- Card 4: 咨询与反馈 -->
      <view class="card normal-card">
        <view class="decor decor-orange"></view>
        <view class="icon-box bg-orange">
          <image src="/static/icons/help-circle.svg" mode="aspectFit" style="width: 20px; height: 20px;"></image>
        </view>
        <text class="card-title">咨询与反馈</text>
        <text class="card-desc">常见问题与在线客服</text>
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
.container {
  padding-top: 40px;
}
.header {
  padding: 0 24px;
  margin-bottom: 24px;
}
.title {
  display: block;
  font-size: 24px;
  font-weight: 900;
  color: #111827;
}
.subtitle {
  display: block;
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
}

.grid-container {
  padding: 0 24px;
  column-count: 2;
  column-gap: 16px;
}
.card {
  break-inside: avoid;
  margin-bottom: 16px;
  border-radius: 24px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}
.normal-card {
  background-color: #ffffff;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);
}
.highlight-card {
  background-color: #EBF6E4;
}

.decor {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 100px;
  height: 100px;
  border-bottom-left-radius: 100%;
}
.decor-blue { background-color: #eff6ff; opacity: 0.6; }
.decor-purple { background-color: #faf5ff; opacity: 0.6; }
.decor-orange { background-color: #fff7ed; opacity: 0.6; }
.decor-green { background-color: #9FE870; opacity: 0.4; mix-blend-mode: multiply; }

.icon-box {
  width: 40px;
  height: 40px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  position: relative;
  z-index: 10;
}
.bg-blue { background-color: #dbeafe; }
.bg-purple { background-color: #f3e8ff; }
.bg-orange { background-color: #ffedd5; }
.bg-green-light { background-color: rgba(255,255,255,0.5); }

.card-tag {
  display: block;
  font-size: 11px;
  color: #a855f7;
  font-weight: bold;
  margin-bottom: 4px;
  position: relative;
  z-index: 10;
}
.card-title {
  display: block;
  font-size: 16px;
  font-weight: bold;
  color: #111827;
  margin-bottom: 4px;
  position: relative;
  z-index: 10;
}
.card-desc {
  display: block;
  font-size: 12px;
  color: #6b7280;
  position: relative;
  z-index: 10;
}
.text-green {
  color: #163300;
}
.text-green-sub {
  color: #163300;
  opacity: 0.8;
}
</style>
