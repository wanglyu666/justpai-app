<template>
  <view class="messages-content">
    <view class="page-header">
      <view
        class="icon-btn"
        hover-class="icon-btn-hover"
        :hover-stay-time="80"
        @click.stop="handleBack"
      >
        <image
          src="/static/icons/chevron-left.svg"
          mode="aspectFit"
          class="header-icon-img"
        />
      </view>
    </view>

    <view class="content">
      <text class="page-title">消息</text>
      <text class="page-desc">查看系统通知与重要提醒</text>

      <view class="message-list">
        <view class="message-card" v-for="item in messages" :key="item.id">
          <view class="message-icon-circle">
            <image :src="item.icon" mode="aspectFit" class="message-icon-img"></image>
          </view>
          <view class="message-card-content">
            <text class="message-card-title">{{ item.title }}</text>
            <text class="message-card-desc">{{ item.desc }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  back: [];
}>();

const messages = ref([
  {
    id: 1,
    title: '系统通知',
    desc: '您的企业账号资料已提交，预计 1-3 个工作日内完成审核。',
    icon: '/static/bell.svg',
  },
  {
    id: 2,
    title: '任务提醒',
    desc: '今日还有 3 项待办未完成，建议优先处理团队同步会议。',
    icon: '/static/icons/file-text.svg',
  },
  {
    id: 3,
    title: '账户安全',
    desc: '检测到您近期修改了登录密码，如非本人操作请及时联系客服。',
    icon: '/static/icons/shield.svg',
  },
  {
    id: 4,
    title: '平台公告',
    desc: '全新 AI 功能已上线，可在工作台体验效率提升相关能力。',
    icon: '/static/icons/book-open.svg',
  },
]);

const handleBack = () => {
  emit('back');
};
</script>

<style scoped>
.messages-content {
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

.icon-btn-hover {
  opacity: 0.85;
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
}

.page-desc {
  display: block;
  margin-top: 16rpx;
  margin-bottom: 48rpx;
  font-size: 28rpx;
  color: #6b7280;
  line-height: 1.5;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.message-card {
  display: flex;
  align-items: flex-start;
  background-color: #ffffff;
  border-radius: 32rpx;
  padding: 24rpx 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.message-icon-circle {
  width: 88rpx;
  height: 88rpx;
  margin-right: 24rpx;
  flex-shrink: 0;
  border-radius: 50%;
  border: 2rpx solid #e5e7eb;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-icon-img {
  width: 40rpx;
  height: 40rpx;
  filter: brightness(0);
}

.message-card-content {
  flex: 1;
  min-width: 0;
  padding-top: 0;
}

.message-card-title {
  display: block;
  font-size: 30rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.3;
  margin-bottom: 8rpx;
}

.message-card-desc {
  display: block;
  font-size: 24rpx;
  color: #6b7280;
  line-height: 1.45;
}
</style>
