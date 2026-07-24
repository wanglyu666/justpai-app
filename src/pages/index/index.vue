<template>
  <view class="container">
    <!-- Header -->
    <view class="header">
      <view class="header-right">
        <view class="icon-btn">
          <image src="/static/scan.svg" mode="aspectFit" class="icon"></image>
        </view>
      </view>
    </view>

    <!-- Banner Carousel -->
    <view class="section banner-section">
      <scroll-view scroll-x="true" class="scroll-view_H" :show-scrollbar="false">
        <view class="banner-item active">
          <view class="banner-decor1"></view>
          <view class="banner-decor2"></view>
          <text class="banner-title">释放你的\n潜能</text>
          <text class="banner-subtitle">新功能已上线</text>
        </view>
        <view class="banner-item normal">
          <text class="banner-title dark">提升你的\n工作流</text>
          <text class="banner-subtitle dark-sub">探索最新更新</text>
        </view>
      </scroll-view>
    </view>

    <!-- To-Do List -->
    <view class="section">
      <view class="card">
        <view class="card-header">
          <text class="card-title">待办事项</text>
          <view class="add-btn">
            <text class="add-icon">+</text>
            <text class="add-text">添加任务</text>
          </view>
        </view>
        <view class="todo-list">
          <view class="todo-item" v-for="(todo, index) in todos" :key="todo.id" @click="toggleTodo(todo.id)" :class="{ 'no-border': index === todos.length - 1 }">
            <view class="checkbox" :class="{ 'checked': todo.completed }">
              <text v-if="todo.completed" class="check-icon">✓</text>
            </view>
            <text class="todo-text" :class="{ 'completed': todo.completed }">{{ todo.text }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Latest News -->
    <view class="section">
      <text class="section-title">最新动态</text>
      <scroll-view scroll-x="true" class="scroll-view_H" :show-scrollbar="false">
        <view class="news-item active">
          <text class="news-title">全新 AI 功能提升效率</text>
          <text class="news-desc">使用新工具，体验高达 40% 的工作流加速。</text>
          <text class="news-time">2 分钟前</text>
        </view>
        <view class="news-item normal">
          <text class="news-title dark">2024 全球科技展望</text>
          <text class="news-desc dark-sub">参加即将举行的全球科技大会。</text>
          <text class="news-time">1 小时前</text>
        </view>
      </scroll-view>
    </view>

    <!-- Custom TabBar -->
    <CustomTabBar currentPath="pages/index/index" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import CustomTabBar from '@/components/CustomTabBar.vue';

onShow(() => {
  uni.hideTabBar({ animation: false });
});

const todos = ref([
  { id: 1, text: '上午10点团队同步会议', completed: true },
  { id: 2, text: '完成项目报告 - 第二阶段', completed: false },
  { id: 3, text: '致电客户获取反馈', completed: false },
]);

const toggleTodo = (id: number) => {
  const todo = todos.value.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
  }
};
</script>

<style scoped>
.container {
  padding-bottom: 20px;
}
.header {
  padding: 40px 24px 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
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
.icon {
  width: 22px;
  height: 22px;
}

.section {
  padding: 0 24px;
  margin-bottom: 30px;
}
.banner-section {
  padding: 0;
}
.scroll-view_H {
  white-space: nowrap;
  width: 100%;
}
.banner-item {
  display: inline-block;
  width: 80%;
  border-radius: 24px;
  padding: 28px;
  margin-right: 16px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}
.banner-item:first-child {
  margin-left: 24px;
}
.banner-item.active {
  background-color: #EBF6E4;
}
.banner-item.normal {
  background-color: #ffffff;
  border: 1px solid #f0f0f0;
}
.banner-decor1 {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: rgba(159, 232, 112, 0.4);
  filter: blur(20px);
}
.banner-decor2 {
  position: absolute;
  bottom: -30px;
  left: -30px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: rgba(159, 232, 112, 0.4);
  filter: blur(15px);
}
.banner-title {
  display: block;
  font-size: 28px;
  font-weight: 900;
  color: #163300;
  line-height: 1.2;
  position: relative;
  z-index: 10;
  margin-bottom: 16px;
}
.banner-title.dark {
  color: #111827;
}
.banner-subtitle {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #163300;
  opacity: 0.8;
  position: relative;
  z-index: 10;
}
.banner-subtitle.dark-sub {
  color: #6b7280;
}

.card {
  background-color: #ffffff;
  border-radius: 28px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.card-title {
  font-size: 20px;
  font-weight: bold;
  color: #111827;
}
.add-btn {
  display: flex;
  align-items: center;
}
.add-icon {
  color: #4B732B;
  font-size: 18px;
  margin-right: 4px;
  font-weight: bold;
}
.add-text {
  color: #4B732B;
  font-size: 14px;
  font-weight: 600;
}
.todo-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;
}
.todo-item.no-border {
  border-bottom: none;
}
.checkbox {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 2px solid #e5e7eb;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.checkbox.checked {
  background-color: #9FE870;
  border: none;
}
.check-icon {
  color: #163300;
  font-size: 14px;
  font-weight: bold;
}
.todo-text {
  font-size: 15px;
  font-weight: 500;
  color: #374151;
}
.todo-text.completed {
  color: #9ca3af;
  text-decoration: line-through;
}

.section-title {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: #111827;
  margin-bottom: 16px;
}
.news-item {
  display: inline-flex;
  flex-direction: column;
  width: 70%;
  border-radius: 24px;
  padding: 20px;
  margin-right: 16px;
  box-sizing: border-box;
  white-space: normal;
}
.news-item:first-child {
  margin-left: 24px;
}
.news-item.active {
  background-color: #F2F7ED;
}
.news-item.normal {
  background-color: #ffffff;
  border: 1px solid #f0f0f0;
}
.news-title {
  font-size: 17px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #163300;
}
.news-title.dark {
  color: #111827;
}
.news-desc {
  font-size: 13px;
  color: #4b5563;
  margin-bottom: 20px;
  line-height: 1.5;
  flex-grow: 1;
}
.news-desc.dark-sub {
  color: #6b7280;
}
.news-time {
  font-size: 11px;
  color: #9ca3af;
  font-weight: 600;
  align-self: flex-end;
}
</style>
