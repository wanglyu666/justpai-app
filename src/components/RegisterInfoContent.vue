<template>
  <view class="register-info">
    <view class="page-header">
      <view class="icon-btn" @click="handleBack">
        <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="header-icon-img"></image>
      </view>
    </view>

    <view class="content">
      <text class="page-title">注册信息</text>

      <view class="info-list">
        <view class="info-item">
          <text class="info-label">公司名称</text>
          <text class="info-value">这么派（上海）科技有限公司</text>
        </view>

        <view class="info-item license-item">
          <text class="info-label">营业执照</text>
          <view class="license-wrap">
            <image
              src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80"
              mode="aspectFill"
              class="license-img"
            ></image>
          </view>
        </view>

        <view class="info-item">
          <text class="info-label">所属行业</text>
          <text class="info-value">建筑装饰与工程服务</text>
        </view>

        <view class="info-item">
          <text class="info-label">姓名</text>
          <text class="info-value">管理员</text>
        </view>

        <view class="info-item">
          <text class="info-label">职位</text>
          <text class="info-value">系统管理员</text>
        </view>

        <view class="info-item">
          <text class="info-label">联系方式</text>
          <text class="info-value">138-0013-8000</text>
        </view>

        <view class="info-item">
          <text class="info-label">邮箱</text>
          <text class="info-value">admin@justpai.com</text>
        </view>

        <view class="info-item info-item-last">
          <text class="info-label">服务区域</text>
          <text class="info-value">上海市、江苏省、浙江省</text>
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
.register-info {
  min-height: 100%;
  padding-bottom: 80rpx;
  box-sizing: border-box;
}

.page-header {
  padding: 0 48rpx;
}

.icon-btn {
  width: 88rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
}

.header-icon-img {
  width: 40rpx;
  height: 40rpx;
}

.content {
  padding: 64rpx 48rpx 0;
}

.page-title {
  display: block;
  font-size: 56rpx;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.35;
  margin-bottom: 56rpx;
}

.info-list {
  display: flex;
  flex-direction: column;
}

.info-item {
  padding: 40rpx 0;
  border-bottom: 2rpx solid #e5e7eb;
}

.info-item-last {
  border-bottom: none;
}

.info-label {
  display: block;
  font-size: 28rpx;
  color: #9ca3af;
  line-height: 1.4;
  margin-bottom: 20rpx;
}

.info-value {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.45;
}

.license-item {
  padding-bottom: 48rpx;
}

.license-wrap {
  width: 100%;
  height: 360rpx;
  border-radius: 32rpx;
  background-color: #e5e7eb;
  overflow: hidden;
}

.license-img {
  width: 100%;
  height: 100%;
}
</style>
