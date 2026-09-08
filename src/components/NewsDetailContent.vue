<template>
  <view class="news-detail">
    <view class="page-header">
      <view class="icon-btn" @click="handleBack">
        <image
          src="/static/icons/chevron-left.svg"
          mode="aspectFit"
          class="header-icon-img"
        />
      </view>
      <view class="icon-btn" @click="openShareSheet">
        <image
          src="/static/icons/share-2.svg"
          mode="aspectFit"
          class="header-icon-img"
        />
      </view>
    </view>

    <view class="content">
      <text class="news-title">{{ item.title }}</text>
      <view class="news-meta">
        <text class="news-meta-text">{{ item.author }}</text>
        <text class="news-meta-sep">|</text>
        <text class="news-meta-text">{{ item.date }}</text>
        <text class="news-meta-sep">|</text>
        <text class="news-meta-text">{{ item.category }}</text>
      </view>
      <view class="news-cover">
        <image :src="item.image" mode="aspectFill" class="news-cover-img" />
      </view>
      <view class="news-body">
        <text v-for="(paragraph, index) in item.content" :key="index" class="news-paragraph">
          {{ paragraph }}
        </text>
      </view>
    </view>

    <view v-if="shareRendered" class="share-sheet-root">
      <view class="share-sheet-mask" :class="{ closing: shareClosing }" @click="closeShareSheet" />
      <view class="share-sheet-panel" :class="{ closing: shareClosing }">
        <view class="share-sheet-actions">
          <view
            v-for="action in shareActions"
            :key="action.id"
            class="share-action"
            @click="handleShareAction(action.id)"
          >
            <view class="share-action-btn" :style="{ backgroundColor: action.color }">
              <image
                v-if="action.icon"
                :src="action.icon"
                mode="aspectFit"
                class="share-action-icon"
              />
            </view>
            <text class="share-action-label">{{ action.label }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { usePageBack, usePageBackWhen } from '@/composables/usePageBack';

export type NewsItem = {
  id: number;
  date: string;
  author: string;
  category: string;
  title: string;
  image: string;
  content: string[];
};

const props = defineProps<{
  item: NewsItem;
}>();

const emit = defineEmits<{
  back: [];
}>();

const SHARE_CLOSE_MS = 320;

const shareOpen = ref(false);
const shareRendered = ref(false);
const shareClosing = ref(false);
let shareCloseTimer: ReturnType<typeof setTimeout> | null = null;

const shareActions = [
  { id: 'copy', label: '复制链接', icon: '/static/icons/link.svg', color: '#f3f4f6' },
  { id: 'wechat', label: '分享到微信', icon: '/static/icons/wechat.svg', color: '#08C060' },
  { id: 'moments', label: '分享到朋友圈', icon: '/static/icons/moments.svg', color: '#67CD23' },
  { id: 'qq', label: '分享到QQ', icon: '/static/icons/QQ.svg', color: '#13B7F6' },
] as const;

type ShareActionId = (typeof shareActions)[number]['id'];

const clearShareCloseTimer = () => {
  if (shareCloseTimer) {
    clearTimeout(shareCloseTimer);
    shareCloseTimer = null;
  }
};

const startShareClose = () => {
  if (shareClosing.value) return;

  shareOpen.value = false;
  shareClosing.value = true;
  clearShareCloseTimer();
  shareCloseTimer = setTimeout(() => {
    shareRendered.value = false;
    shareClosing.value = false;
    shareCloseTimer = null;
  }, SHARE_CLOSE_MS);
};

watch(shareOpen, (visible) => {
  if (visible) {
    clearShareCloseTimer();
    shareRendered.value = true;
    shareClosing.value = false;
  }
});

const openShareSheet = () => {
  shareOpen.value = true;
};

const closeShareSheet = () => {
  if (!shareRendered.value || shareClosing.value) return;
  startShareClose();
};

const copyShareLink = () => {
  const href =
    typeof window !== 'undefined' && window.location?.href
      ? window.location.href
      : `https://justpai.com/news/${props.item.id}`;

  uni.setClipboardData({
    data: href,
    success: () => {
      uni.showToast({ title: '链接已复制', icon: 'none' });
    },
  });
};

const handleShareAction = (id: ShareActionId) => {
  if (id === 'copy') {
    copyShareLink();
  }
  closeShareSheet();
};

const handleBack = usePageBack(() => emit('back'));
usePageBackWhen(shareOpen, closeShareSheet);
</script>

<style scoped>
.news-detail {
  min-height: 100%;
  padding-bottom: 80rpx;
  box-sizing: border-box;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  padding: 48rpx 48rpx 0;
}

.news-title {
  display: block;
  font-size: 48rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.35;
}

.news-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 28rpx;
}

.news-meta-text {
  font-size: 28rpx;
  color: #9ca3af;
  line-height: 1.4;
}

.news-meta-sep {
  margin: 0 16rpx;
  font-size: 28rpx;
  color: #d1d5db;
  line-height: 1.4;
}

.news-cover {
  margin-top: 48rpx;
  width: 100%;
  height: 400rpx;
  border-radius: 32rpx;
  overflow: hidden;
  background-color: #e5e7eb;
}

.news-cover-img {
  width: 100%;
  height: 100%;
  display: block;
}

.news-body {
  margin-top: 40rpx;
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.news-paragraph {
  display: block;
  font-size: 34rpx;
  color: #374151;
  line-height: 1.75;
}

.share-sheet-root {
  position: fixed;
  inset: 0;
  z-index: 2500;
}

.share-sheet-mask {
  position: absolute;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.45);
  animation: share-sheet-mask-in 320ms ease forwards;
}

.share-sheet-mask.closing {
  animation: share-sheet-mask-out 320ms ease forwards;
}

.share-sheet-panel {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  border-radius: 40rpx 40rpx 0 0;
  box-sizing: border-box;
  padding: 56rpx 32rpx calc(48rpx + env(safe-area-inset-bottom, 0px));
  animation: share-sheet-slide-up 320ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.share-sheet-panel.closing {
  animation: share-sheet-slide-down 320ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.share-sheet-actions {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.share-action {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.share-action-btn {
  width: 112rpx;
  height: 112rpx;
  border-radius: 56rpx;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.share-action-icon {
  width: 56rpx;
  height: 56rpx;
  display: block;
}

.share-action-label {
  margin-top: 16rpx;
  max-width: 140rpx;
  font-size: 22rpx;
  color: #6b7280;
  line-height: 1.3;
  text-align: center;
}

@keyframes share-sheet-slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes share-sheet-slide-down {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}

@keyframes share-sheet-mask-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes share-sheet-mask-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
