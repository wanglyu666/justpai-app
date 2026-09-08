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

      <view
        class="message-group"
        v-for="group in messageGroups"
        :key="group.date"
      >
        <text class="date-heading">{{ group.date }}</text>
        <view class="message-list">
          <view
            class="message-row"
            v-for="item in group.items"
            :key="item.id"
          >
            <view class="message-icon-wrap">
              <image :src="item.icon" mode="aspectFit" class="message-icon-img" />
            </view>
            <view class="message-body">
              <view class="message-top">
                <view class="message-title-wrap">
                  <view v-if="item.unread" class="unread-dot" />
                  <text class="message-title">{{ item.title }}</text>
                </view>
                <text class="message-time">{{ item.time }}</text>
              </view>
              <text class="message-desc">{{ item.desc }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { usePageBack } from '@/composables/usePageBack';

const emit = defineEmits<{
  back: [];
}>();

type MessageItem = {
  id: number;
  title: string;
  desc: string;
  icon: string;
  date: string;
  time: string;
  unread: boolean;
};

const messages = ref<MessageItem[]>([
  {
    id: 1,
    title: '系统通知',
    desc: '您的企业账号资料已提交，预计 1-3 个工作日内完成审核。',
    icon: '/static/bell.svg',
    date: '今天',
    time: '10:24',
    unread: true,
  },
  {
    id: 2,
    title: '任务提醒',
    desc: '今日还有 3 项待办未完成，建议优先处理团队同步会议。',
    icon: '/static/icons/file-text.svg',
    date: '今天',
    time: '09:15',
    unread: true,
  },
  {
    id: 3,
    title: '账户安全',
    desc: '检测到您近期修改了登录密码，如非本人操作请及时联系客服。',
    icon: '/static/icons/shield.svg',
    date: '昨天',
    time: '18:32',
    unread: false,
  },
  {
    id: 4,
    title: '平台公告',
    desc: '全新 AI 功能已上线，可在工作台体验效率提升相关能力。',
    icon: '/static/icons/book-open.svg',
    date: '9月1日',
    time: '14:05',
    unread: false,
  },
]);

const messageGroups = computed(() => {
  const groups: { date: string; items: MessageItem[] }[] = [];
  for (const item of messages.value) {
    const last = groups[groups.length - 1];
    if (last?.date === item.date) {
      last.items.push(item);
    } else {
      groups.push({ date: item.date, items: [item] });
    }
  }
  return groups;
});

const handleBack = usePageBack(() => emit('back'));
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

.message-group + .message-group {
  margin-top: 72rpx;
}

.date-heading {
  display: block;
  margin-bottom: 40rpx;
  font-size: 52rpx;
  font-weight: 900;
  color: #111827;
  line-height: 1.3;
}

.message-list {
  background-color: #ffffff;
  border-radius: 32rpx;
  overflow: hidden;
}

.message-row {
  display: flex;
  align-items: flex-start;
  padding: 32rpx;
}

.message-row + .message-row {
  border-top: 2rpx solid #f3f4f6;
}

.message-icon-wrap {
  width: 64rpx;
  height: 64rpx;
  margin-right: 24rpx;
  flex-shrink: 0;
  border-radius: 16rpx;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-icon-img {
  width: 32rpx;
  height: 32rpx;
  filter: brightness(0);
}

.message-body {
  flex: 1;
  min-width: 0;
}

.message-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.message-title-wrap {
  display: flex;
  align-items: center;
  min-width: 0;
  flex: 1;
}

.unread-dot {
  width: 12rpx;
  height: 12rpx;
  margin-right: 12rpx;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: #9fe870;
}

.message-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
}

.message-time {
  flex-shrink: 0;
  font-size: 22rpx;
  color: #9ca3af;
  line-height: 1.3;
}

.message-desc {
  display: block;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #6b7280;
  line-height: 1.5;
}
</style>
