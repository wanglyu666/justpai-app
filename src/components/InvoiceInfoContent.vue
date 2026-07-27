<template>
  <view class="invoice-info">
    <view class="page-header">
      <view class="icon-btn" @click="handleBack">
        <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="header-icon-img"></image>
      </view>
    </view>

    <view class="content">
      <text class="page-title">开票信息</text>

      <view class="info-list">
        <view class="info-item">
          <text class="info-label">企业全称</text>
          <text class="info-value">这么派（上海）科技有限公司</text>
        </view>

        <view class="info-item">
          <text class="info-label">统一信用代码</text>
          <text class="info-value">91310000MA1FL2XXXX</text>
        </view>

        <view class="info-item">
          <text class="info-label">注册地址</text>
          <text class="info-value">上海市浦东新区张江高科技园区科苑路 88 号</text>
        </view>

        <view class="info-item">
          <text class="info-label">注册电话</text>
          <text class="info-value">021-5888-6600</text>
        </view>

        <view class="info-item">
          <text class="info-label">开户行</text>
          <text class="info-value">中国工商银行上海张江支行</text>
        </view>

        <view class="info-item info-item-last">
          <text class="info-label">银行账号</text>
          <text class="info-value">1001 2345 6789 0123 456</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  back: [];
}>();

const handleBack = () => {
  emit('back');
};
</script>

<style scoped>
.invoice-info {
  min-height: 100%;
  padding-bottom: 40px;
  box-sizing: border-box;
}

.page-header {
  padding: 0 24px;
}

.icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-icon-img {
  width: 20px;
  height: 20px;
}

.content {
  padding: 32px 24px 0;
}

.page-title {
  display: block;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.35;
  margin-bottom: 28px;
}

.info-list {
  display: flex;
  flex-direction: column;
}

.info-item {
  padding: 20px 0;
  border-bottom: 1px solid #e5e7eb;
}

.info-item-last {
  border-bottom: none;
}

.info-label {
  display: block;
  font-size: 14px;
  color: #9ca3af;
  line-height: 1.4;
  margin-bottom: 10px;
}

.info-value {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  line-height: 1.45;
}
</style>
