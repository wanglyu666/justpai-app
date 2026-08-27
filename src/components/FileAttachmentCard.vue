<template>
  <view class="file-card">
    <view class="file-card-head">
      <view class="file-card-bar" />
      <text class="file-card-title">{{ title }}</text>
    </view>

    <view v-if="files.length" class="file-card-list">
      <FileAttachmentItem
        v-for="(file, index) in files"
        :key="`${file}-${index}`"
        :name="file"
        @click="emit('preview', file)"
      />
    </view>
    <text v-else class="file-card-empty">{{ emptyText }}</text>
  </view>
</template>

<script setup lang="ts">
import FileAttachmentItem from '@/components/FileAttachmentItem.vue';

withDefaults(
  defineProps<{
    title?: string;
    files?: string[];
    emptyText?: string;
  }>(),
  {
    title: '附件',
    files: () => [],
    emptyText: '暂无附件',
  },
);

const emit = defineEmits<{
  preview: [file: string];
}>();
</script>

<style scoped>
.file-card {
  background-color: #ffffff;
  border-radius: 44rpx;
  padding: 36rpx;
  box-sizing: border-box;
  box-shadow: 0 16rpx 48rpx rgba(15, 23, 42, 0.04);
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.file-card-head {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.file-card-bar {
  width: 8rpx;
  height: 28rpx;
  border-radius: 4rpx;
  background-color: #9fe870;
  flex-shrink: 0;
}

.file-card-title {
  font-size: 28rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
}

.file-card-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.file-card-empty {
  font-size: 28rpx;
  color: #9ca3af;
  line-height: 1.4;
}
</style>
