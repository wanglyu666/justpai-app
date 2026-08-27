<template>
  <view class="file-item" @click="emit('click')">
    <view class="file-ext" :class="`ext-${kind}`">
      <text class="file-ext-text">{{ ext }}</text>
    </view>
    <text class="file-name">{{ displayName }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { fileDisplayName, fileExt, fileKind } from '@/utils/fileDisplay';

const props = defineProps<{
  name: string;
}>();

const emit = defineEmits<{
  click: [];
}>();

const displayName = computed(() => fileDisplayName(props.name));
const ext = computed(() => fileExt(props.name));
const kind = computed(() => fileKind(props.name));
</script>

<style scoped>
.file-item {
  width: 100%;
  min-height: 96rpx;
  padding: 20rpx 24rpx;
  border-radius: 28rpx;
  background-color: #f8fafc;
  border: 2rpx solid #eef2f7;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.file-ext {
  width: 80rpx;
  height: 56rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: #e5e7eb;
}

.file-ext-text {
  font-size: 20rpx;
  font-weight: 800;
  color: #374151;
  line-height: 1;
}

.ext-pdf {
  background-color: #fee2e2;
}

.ext-pdf .file-ext-text {
  color: #b91c1c;
}

.ext-image {
  background-color: #dbeafe;
}

.ext-image .file-ext-text {
  color: #1d4ed8;
}

.ext-video {
  background-color: #ede9fe;
}

.ext-video .file-ext-text {
  color: #6d28d9;
}

.ext-sheet {
  background-color: #dcfce7;
}

.ext-sheet .file-ext-text {
  color: #15803d;
}

.ext-doc {
  background-color: #dbeafe;
}

.ext-doc .file-ext-text {
  color: #1d4ed8;
}

.file-name {
  flex: 1;
  min-width: 0;
  font-size: 26rpx;
  font-weight: 600;
  color: #111827;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
