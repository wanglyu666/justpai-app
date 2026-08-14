<template>
  <view class="container page-safe-top">
    <!-- Header -->
    <view class="header">
      <view class="avatar-btn" @click="goToProfile">
        <image
          src="https://api.dicebear.com/7.x/notionists/svg?seed=Admin&backgroundColor=f8aba6"
          mode="aspectFill"
          class="avatar-img"
        ></image>
      </view>
      <view class="header-actions">
        <view class="action-item" @click="goToMessages">
          <image src="/static/bell.svg" mode="aspectFit" class="icon"></image>
        </view>
        <view class="action-divider"></view>
        <view class="action-item">
          <image src="/static/scan.svg" mode="aspectFit" class="icon"></image>
        </view>
      </view>
    </view>

    <!-- Banner Carousel -->
    <view class="section banner-section">
      <swiper
        class="banner-swiper"
        :indicator-dots="true"
        :autoplay="true"
        :interval="4000"
        :duration="500"
        indicator-color="rgba(22, 51, 0, 0.2)"
        indicator-active-color="#163300"
        circular
      >
        <swiper-item v-for="(banner, index) in banners" :key="index">
          <view class="banner-item">
            <image :src="banner.image" mode="aspectFill" class="banner-image"></image>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- To-Do List -->
    <view class="section">
      <view class="todo-panel">
        <view class="todo-panel-header">
          <view class="progress-ring">
            <view
              class="progress-ring-dial"
              :style="{ backgroundImage: progressRingBackground }"
            />
            <view class="progress-ring-inner">
              <text class="progress-text">{{ completedCount }}/{{ todos.length }}</text>
            </view>
          </view>
          <view class="todo-panel-header-text">
            <text class="todo-panel-title">今日待办</text>
            <text class="todo-panel-desc">完成以下任务，提升工作效率</text>
          </view>
          <view class="todo-panel-action-btn" @click.stop="onTodoAction">
            <image
              src="/static/icons/arrow-up-right.svg"
              mode="aspectFit"
              class="todo-panel-action-icon"
            />
          </view>
        </view>

        <view class="todo-task-list">
          <view class="todo-task-card" v-for="todo in todos" :key="todo.id">
            <view class="todo-icon-circle">
              <image :src="todo.icon" mode="aspectFit" class="todo-icon-img"></image>
            </view>
            <view class="todo-task-content">
              <text class="todo-task-title">{{ todo.title }}</text>
              <text class="todo-task-desc">{{ todo.desc }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- Latest News -->
    <view class="news-section">
      <text class="section-title">最新动态</text>
      <scroll-view scroll-x="true" class="news-scroll" :show-scrollbar="false">
        <view class="news-slide" v-for="item in newsItems" :key="item.id">
          <view class="news-text">
            <text class="news-date">{{ item.date }}</text>
            <text class="news-title">{{ item.title }}</text>
          </view>
          <view class="news-cover">
            <image :src="item.image" mode="aspectFill" class="news-cover-img"></image>
          </view>
        </view>
      </scroll-view>
    </view>

    <SlideOverPanel :show="profileVisible">
      <ProfileContent @back="closeProfile" />
    </SlideOverPanel>
    <SlideOverPanel :show="messagesVisible" :z-index="1100">
      <MessagesContent @back="closeMessages" />
    </SlideOverPanel>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import SlideOverPanel from '@/components/SlideOverPanel.vue';
import ProfileContent from '@/components/ProfileContent.vue';
import MessagesContent from '@/components/MessagesContent.vue';
import { useSlideOver } from '@/composables/useSlideOver';

const { visible: profileVisible, open: openProfile, close: closeProfile } = useSlideOver();
const { visible: messagesVisible, open: openMessages, close: closeMessages } = useSlideOver();

const todos = ref([
  {
    id: 1,
    title: '团队同步会议',
    desc: '上午10点与团队进行项目进度同步，确认本周目标与分工。',
    icon: '/static/icons/users.svg',
    completed: false,
  },
  {
    id: 2,
    title: '完成项目报告',
    desc: '整理第二阶段数据与分析结论，提交项目组审阅。',
    icon: '/static/icons/file-text.svg',
    completed: false,
  },
]);

const PROGRESS_RADIUS = 22;
const PROGRESS_CIRCUMFERENCE = 2 * Math.PI * PROGRESS_RADIUS;

const completedCount = computed(() => todos.value.filter((todo) => todo.completed).length);

const progressRingBackground = computed(() => {
  const total = todos.value.length || 1;
  const done = completedCount.value;
  let ratio = done / total;

  if (done === 0) {
    ratio = 12 / PROGRESS_CIRCUMFERENCE;
  } else if (done === total) {
    ratio = 1;
  }

  const deg = `${(ratio * 360).toFixed(2)}deg`;
  return `conic-gradient(from -90deg, #163300 0deg, #163300 ${deg}, #9fe870 ${deg} 360deg)`;
});

const onTodoAction = () => {
  // 预留：进入待办详情/完整列表
};

const banners = ref([
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop',
  },
]);

const newsItems = ref([
  {
    id: 1,
    date: '2026-07-25',
    title: '全新 AI 功能提升效率，体验高达 40% 的工作流加速',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 2,
    date: '2026-07-20',
    title: '2024 全球科技展望，参加即将举行的全球科技大会',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    date: '2026-07-15',
    title: '团队协作功能全面升级，多人实时编辑更高效',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
  },
]);

const goToProfile = () => {
  openProfile();
};

const goToMessages = () => {
  openMessages();
};
</script>

<style scoped>
.container {
  padding-bottom: 40rpx;
}
.header {
  padding: 0 48rpx 40rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.avatar-btn {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  background-color: #ffffff;
  padding: 4rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}
.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: block;
}
.icon-btn {
  width: 88rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 8rpx rgba(0,0,0,0.05);
}
.header-actions {
  display: flex;
  align-items: center;
  height: 88rpx;
  border-radius: 44rpx;
  background-color: #ffffff;
  box-shadow: 0 4rpx 8rpx rgba(0,0,0,0.05);
}
.action-item {
  width: 88rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.action-divider {
  width: 2rpx;
  height: 40rpx;
  background-color: #e5e7eb;
}
.icon {
  width: 44rpx;
  height: 44rpx;
}

.section {
  padding: 0 48rpx;
  margin-bottom: 60rpx;
}
.banner-section {
  padding: 0 48rpx;
}
.banner-swiper {
  height: 320rpx;
  border-radius: 48rpx;
  overflow: hidden;
}
.banner-item {
  width: 100%;
  height: 100%;
  border-radius: 48rpx;
  overflow: hidden;
  box-sizing: border-box;
}
.banner-image {
  width: 100%;
  height: 100%;
  display: block;
}

.todo-panel {
  background-color: #eef0ea;
  border-radius: 48rpx;
  padding: 36rpx 32rpx;
}
.todo-panel-header {
  display: flex;
  align-items: center;
  gap: 24rpx;
}
.progress-ring {
  position: relative;
  width: 104rpx;
  height: 104rpx;
  flex-shrink: 0;
}
.progress-ring-dial {
  width: 104rpx;
  height: 104rpx;
  border-radius: 50%;
}
.progress-ring-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.progress-text {
  font-size: 28rpx;
  font-weight: 900;
  color: #163300;
}
.todo-panel-header-text {
  flex: 1;
  min-width: 0;
}
.todo-panel-title {
  display: block;
  font-size: 32rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.3;
}
.todo-panel-desc {
  display: block;
  margin-top: 8rpx;
  font-size: 26rpx;
  color: #6b7280;
  line-height: 1.4;
}
.todo-panel-action-btn {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  background-color: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.todo-panel-action-icon {
  width: 44rpx;
  height: 44rpx;
  filter: brightness(0) invert(1);
}
.todo-task-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-top: 32rpx;
}
.todo-task-card {
  display: flex;
  align-items: flex-start;
  background-color: #ffffff;
  border-radius: 32rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}
.todo-icon-circle {
  width: 112rpx;
  height: 112rpx;
  margin-right: 28rpx;
  flex-shrink: 0;
  border-radius: 50%;
  border: 2rpx solid #e5e7eb;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.todo-icon-img {
  width: 48rpx;
  height: 48rpx;
  filter: brightness(0);
}
.todo-task-content {
  flex: 1;
  min-width: 0;
  padding-top: 4rpx;
}
.todo-task-title {
  display: block;
  font-size: 32rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.35;
  margin-bottom: 12rpx;
}
.todo-task-desc {
  display: block;
  font-size: 26rpx;
  color: #6b7280;
  line-height: 1.5;
}

.section-title {
  display: block;
  font-size: 40rpx;
  font-weight: bold;
  color: #111827;
  margin-bottom: 32rpx;
}

.news-section {
  margin-bottom: 60rpx;
}
.news-section .section-title {
  padding: 0 48rpx;
}
.news-scroll {
  white-space: nowrap;
  width: 100%;
}
.news-slide {
  display: inline-block;
  width: 82%;
  vertical-align: top;
  margin-right: 24rpx;
  white-space: normal;
  box-sizing: border-box;
}
.news-slide:first-child {
  margin-left: 48rpx;
}
.news-slide:last-child {
  margin-right: 48rpx;
}
.news-text {
  margin-bottom: 24rpx;
}
.news-date {
  display: block;
  font-size: 24rpx;
  color: #9ca3af;
  margin-bottom: 12rpx;
}
.news-title {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  color: #111827;
  line-height: 1.4;
}
.news-cover {
  position: relative;
  width: 100%;
  height: 400rpx;
  border-radius: 32rpx;
  overflow: hidden;
  background-color: #e5e7eb;
}
.news-cover-img {
  width: 100%;
  height: 100%;
}
</style>
