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
        <view class="action-item">
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
        <view class="todo-panel-header" @click="toggleTodoPanel">
          <view class="progress-ring">
            <svg class="progress-svg" viewBox="0 0 52 52">
              <circle class="progress-track" cx="26" cy="26" r="22" />
              <circle
                class="progress-bar"
                cx="26"
                cy="26"
                r="22"
                :stroke-dasharray="progressDasharray"
              />
            </svg>
            <view class="progress-ring-inner">
              <text class="progress-text">{{ completedCount }}/{{ todos.length }}</text>
            </view>
          </view>
          <view class="todo-panel-header-text">
            <text class="todo-panel-title">今日待办</text>
            <text class="todo-panel-desc">完成以下任务，提升工作效率</text>
          </view>
          <text class="todo-panel-chevron" :class="{ collapsed: todoCollapsed }">⌃</text>
        </view>

        <view class="todo-task-list" v-show="!todoCollapsed">
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

    <!-- Custom TabBar -->
    <CustomTabBar currentPath="pages/index/index" />

    <SlideOverPanel :show="profileVisible">
      <ProfileContent @back="closeProfile" />
    </SlideOverPanel>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import CustomTabBar from '@/components/CustomTabBar.vue';
import SlideOverPanel from '@/components/SlideOverPanel.vue';
import ProfileContent from '@/components/ProfileContent.vue';
import { useSlideOver } from '@/composables/useSlideOver';

onShow(() => {
  uni.hideTabBar({ animation: false });
});

const { visible: profileVisible, open: openProfile, close: closeProfile } = useSlideOver();

const todoCollapsed = ref(false);

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
  {
    id: 3,
    title: '致电客户获取反馈',
    desc: '跟进重点客户使用情况，记录问题并安排后续支持。',
    icon: '/static/icons/help-circle.svg',
    completed: false,
  },
]);

const PROGRESS_RADIUS = 22;
const PROGRESS_CIRCUMFERENCE = 2 * Math.PI * PROGRESS_RADIUS;

const completedCount = computed(() => todos.value.filter((todo) => todo.completed).length);

const progressDasharray = computed(() => {
  const total = todos.value.length || 1;
  const done = completedCount.value;
  let filled = (done / total) * PROGRESS_CIRCUMFERENCE;

  if (done === 0) {
    filled = 12;
  } else if (done === total) {
    filled = PROGRESS_CIRCUMFERENCE;
  }

  return `${filled} ${PROGRESS_CIRCUMFERENCE - filled}`;
});

const toggleTodoPanel = () => {
  todoCollapsed.value = !todoCollapsed.value;
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
</script>

<style scoped>
.container {
  padding-bottom: 20px;
}
.header {
  padding: 0 24px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.avatar-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #ffffff;
  padding: 2px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}
.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: block;
}
.icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.header-actions {
  display: flex;
  align-items: center;
  height: 44px;
  border-radius: 22px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.action-item {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.action-divider {
  width: 1px;
  height: 20px;
  background-color: #e5e7eb;
}
.icon {
  width: 22px;
  height: 22px;
}

.section {
  padding: 0 24px;
  margin-bottom: 30px;
}
.banner-section {
  padding: 0 24px;
}
.banner-swiper {
  height: 160px;
  border-radius: 24px;
  overflow: hidden;
}
.banner-item {
  width: 100%;
  height: 100%;
  border-radius: 24px;
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
  border-radius: 24px;
  padding: 18px 16px;
}
.todo-panel-header {
  display: flex;
  align-items: center;
  gap: 12px;
}
.progress-ring {
  position: relative;
  width: 52px;
  height: 52px;
  flex-shrink: 0;
}
.progress-svg {
  width: 52px;
  height: 52px;
  transform: rotate(-90deg);
}
.progress-track {
  fill: none;
  stroke: #9fe870;
  stroke-width: 6;
}
.progress-bar {
  fill: none;
  stroke: #163300;
  stroke-width: 6;
  stroke-linecap: round;
}
.progress-ring-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.progress-text {
  font-size: 14px;
  font-weight: 900;
  color: #163300;
}
.todo-panel-header-text {
  flex: 1;
  min-width: 0;
}
.todo-panel-title {
  display: block;
  font-size: 16px;
  font-weight: 800;
  color: #111827;
  line-height: 1.3;
}
.todo-panel-desc {
  display: block;
  margin-top: 4px;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
}
.todo-panel-chevron {
  font-size: 18px;
  color: #111827;
  line-height: 1;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}
.todo-panel-chevron.collapsed {
  transform: rotate(180deg);
}
.todo-task-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
}
.todo-task-card {
  display: flex;
  align-items: flex-start;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}
.todo-icon-circle {
  width: 56px;
  height: 56px;
  margin-right: 14px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.todo-icon-img {
  width: 24px;
  height: 24px;
  filter: brightness(0);
}
.todo-task-content {
  flex: 1;
  min-width: 0;
  padding-top: 2px;
}
.todo-task-title {
  display: block;
  font-size: 16px;
  font-weight: 800;
  color: #111827;
  line-height: 1.35;
  margin-bottom: 6px;
}
.todo-task-desc {
  display: block;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
}

.section-title {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: #111827;
  margin-bottom: 16px;
}

.news-section {
  margin-bottom: 30px;
}
.news-section .section-title {
  padding: 0 24px;
}
.news-scroll {
  white-space: nowrap;
  width: 100%;
}
.news-slide {
  display: inline-block;
  width: 82%;
  vertical-align: top;
  margin-right: 12px;
  white-space: normal;
  box-sizing: border-box;
}
.news-slide:first-child {
  margin-left: 24px;
}
.news-slide:last-child {
  margin-right: 24px;
}
.news-text {
  margin-bottom: 12px;
}
.news-date {
  display: block;
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 6px;
}
.news-title {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: #111827;
  line-height: 1.4;
}
.news-cover {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 16px;
  overflow: hidden;
  background-color: #e5e7eb;
}
.news-cover-img {
  width: 100%;
  height: 100%;
}
</style>
