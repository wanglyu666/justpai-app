<template>
  <view class="todo-detail">
    <view class="page-header">
      <view class="icon-btn" @click="handleBack">
        <image
          src="/static/icons/chevron-left.svg"
          mode="aspectFit"
          class="header-icon-img"
        />
      </view>
    </view>

    <view class="content">
      <text class="page-title">今日待办</text>
      <text class="page-desc">完成以下任务，提升工作效率</text>

      <view class="todo-list">
        <view class="todo-card" v-for="todo in todos" :key="todo.id">
          <view class="todo-icon-circle">
            <image :src="todo.icon" mode="aspectFit" class="todo-icon-img" />
          </view>
          <view class="todo-card-content">
            <text class="todo-card-title">{{ todo.title }}</text>
            <text class="todo-card-desc">{{ todo.desc }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { usePageBack } from '@/composables/usePageBack';

export type TodoItem = {
  id: number;
  title: string;
  desc: string;
  icon: string;
  completed: boolean;
};

defineProps<{
  todos: TodoItem[];
}>();

const emit = defineEmits<{
  back: [];
}>();

const handleBack = usePageBack(() => emit('back'));
</script>

<style scoped>
.todo-detail {
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
}

.page-desc {
  display: block;
  margin-top: 16rpx;
  margin-bottom: 48rpx;
  font-size: 28rpx;
  color: #6b7280;
  line-height: 1.5;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.todo-card {
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

.todo-card-content {
  flex: 1;
  min-width: 0;
  padding-top: 4rpx;
}

.todo-card-title {
  display: block;
  font-size: 32rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.35;
  margin-bottom: 12rpx;
}

.todo-card-desc {
  display: block;
  font-size: 26rpx;
  color: #6b7280;
  line-height: 1.5;
}
</style>
