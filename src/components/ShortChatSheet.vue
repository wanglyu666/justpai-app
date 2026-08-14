<template>
  <view v-if="isRendered" class="short-chat-root">
    <view class="short-chat-mask" :class="{ closing: isClosing }" @click="handleClose" />
    <view class="short-chat-panel" :class="{ closing: isClosing }">
      <view class="short-chat-header">
        <text class="short-chat-title">短交流</text>
        <view class="short-chat-close" @click="handleClose">
          <text class="short-chat-close-text">×</text>
        </view>
      </view>

      <view class="short-chat-body">
        <view class="section-card">
          <view class="field-label-row">
            <text class="field-label">
              <text class="required">*</text>
              交流内容
            </text>
            <text class="field-count">{{ content.length }}/500</text>
          </view>
          <textarea
            v-model="content"
            class="field-textarea"
            placeholder="请输入本次交流内容"
            placeholder-class="input-placeholder"
            :maxlength="500"
          />
        </view>

        <view class="section-card">
          <text class="section-title">上传附件</text>
          <text class="section-hint">支持图片与视频，最多 3 个</text>

          <view class="media-grid">
            <view
              v-for="(file, index) in mediaFiles"
              :key="`${file.path}-${index}`"
              class="media-item"
            >
              <image
                v-if="file.type === 'image'"
                :src="file.path"
                mode="aspectFill"
                class="media-thumb"
              />
              <view v-else class="media-video">
                <text class="media-video-badge">VIDEO</text>
              </view>
              <view class="media-remove" @click.stop="removeMedia(index)">
                <text class="media-remove-text">×</text>
              </view>
            </view>
          </view>

          <view
            v-if="mediaFiles.length < MAX_MEDIA"
            class="media-add"
            @click="handleChooseMedia"
          >
            <image
              src="/static/icons/image-plus.svg"
              mode="aspectFit"
              class="media-add-icon"
            />
            <text class="media-add-text">添加附件</text>
          </view>
        </view>
      </view>

      <view class="short-chat-footer">
        <view
          class="confirm-btn"
          :class="{ active: isSubmitEnabled }"
          @click="handleConfirm"
        >
          <text class="confirm-btn-text">确认</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

type MediaFile = {
  path: string;
  type: 'image' | 'video';
  name: string;
};

const MAX_MEDIA = 3;
const CLOSE_DURATION_MS = 320;

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [payload: { content: string; attachments: string[] }];
}>();

const isRendered = ref(false);
const isClosing = ref(false);
const content = ref('');
const mediaFiles = ref<MediaFile[]>([]);
let closeTimer: ReturnType<typeof setTimeout> | null = null;
let pendingConfirm: { content: string; attachments: string[] } | null = null;

const isSubmitEnabled = computed(() => content.value.trim().length > 0);

const clearCloseTimer = () => {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
};

const resetForm = () => {
  content.value = '';
  mediaFiles.value = [];
};

const startClose = (event: 'close' | 'confirm') => {
  if (isClosing.value) return;
  isClosing.value = true;
  clearCloseTimer();
  closeTimer = setTimeout(() => {
    isRendered.value = false;
    isClosing.value = false;
    closeTimer = null;
    if (event === 'confirm' && pendingConfirm) {
      emit('confirm', pendingConfirm);
      pendingConfirm = null;
    } else {
      pendingConfirm = null;
      emit('close');
    }
    resetForm();
  }, CLOSE_DURATION_MS);
};

watch(
  () => props.show,
  (show) => {
    if (show) {
      clearCloseTimer();
      isClosing.value = false;
      isRendered.value = true;
      resetForm();
      return;
    }
    if (isRendered.value && !isClosing.value) {
      startClose('close');
    }
  },
  { immediate: true },
);

const handleClose = () => {
  startClose('close');
};

const handleConfirm = () => {
  if (!isSubmitEnabled.value) return;
  pendingConfirm = {
    content: content.value.trim(),
    attachments: mediaFiles.value.map((file) => file.name),
  };
  startClose('confirm');
};

const chooseImagesFallback = (remain: number) => {
  uni.chooseImage({
    count: remain,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const next = res.tempFilePaths.map((path) => ({
        path,
        type: 'image' as const,
        name: path.split('/').pop() || 'image.jpg',
      }));
      mediaFiles.value = [...mediaFiles.value, ...next].slice(0, MAX_MEDIA);
    },
  });
};

const handleChooseMedia = () => {
  const remain = MAX_MEDIA - mediaFiles.value.length;
  if (remain <= 0) return;

  const chooseMediaApi = (uni as any).chooseMedia as typeof uni.chooseMedia | undefined;
  if (typeof chooseMediaApi === 'function') {
    chooseMediaApi({
      count: remain,
      mediaType: ['image', 'video'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const next = res.tempFiles.map((file) => {
          const isVideo = file.fileType === 'video';
          const path = file.tempFilePath;
          const name = path.split('/').pop() || (isVideo ? 'video.mp4' : 'image.jpg');
          return {
            path,
            type: (isVideo ? 'video' : 'image') as MediaFile['type'],
            name,
          };
        });
        mediaFiles.value = [...mediaFiles.value, ...next].slice(0, MAX_MEDIA);
      },
      fail: () => {
        chooseImagesFallback(remain);
      },
    });
    return;
  }

  chooseImagesFallback(remain);
};

const removeMedia = (index: number) => {
  mediaFiles.value = mediaFiles.value.filter((_, i) => i !== index);
};
</script>

<style scoped>
.short-chat-root {
  position: fixed;
  inset: 0;
  z-index: 2600;
}

.short-chat-mask {
  position: absolute;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.45);
  animation: short-chat-mask-in 320ms ease forwards;
}

.short-chat-mask.closing {
  animation: short-chat-mask-out 320ms ease forwards;
}

.short-chat-panel {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 78vh;
  max-height: 1640rpx;
  background-color: #f4f5f7;
  border-radius: 48rpx 48rpx 0 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  animation: short-chat-slide-up 320ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.short-chat-panel.closing {
  animation: short-chat-slide-down 320ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
}

.short-chat-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 112rpx;
  flex-shrink: 0;
}

.short-chat-title {
  font-size: 34rpx;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
}

.short-chat-close {
  position: absolute;
  right: 32rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.short-chat-close-text {
  font-size: 48rpx;
  line-height: 1;
  color: #9ca3af;
}

.short-chat-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 8rpx 40rpx 24rpx;
  box-sizing: border-box;
}

.section-card {
  background-color: #ffffff;
  border-radius: 40rpx;
  padding: 36rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(15, 23, 42, 0.04);
  box-sizing: border-box;
}

.section-title {
  display: block;
  font-size: 30rpx;
  font-weight: 800;
  color: #111827;
  margin-bottom: 12rpx;
}

.section-hint {
  display: block;
  margin-bottom: 28rpx;
  font-size: 24rpx;
  color: #9ca3af;
  line-height: 1.4;
}

.field-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.field-label {
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.2;
}

.field-count {
  font-size: 24rpx;
  color: #9ca3af;
}

.required {
  color: #ef4444;
  margin-right: 4rpx;
}

.field-textarea {
  width: 100%;
  min-height: 240rpx;
  padding: 24rpx 28rpx;
  background-color: #f8fafc;
  border: 2rpx solid #eef2f7;
  border-radius: 28rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #111827;
  line-height: 1.55;
  box-sizing: border-box;
}

.input-placeholder {
  color: #d1d5db;
  font-size: 28rpx;
}

.media-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.media-grid:not(:empty) {
  margin-bottom: 20rpx;
}

.media-item {
  width: calc((100% - 40rpx) / 3);
  aspect-ratio: 1;
  border-radius: 28rpx;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
}

.media-thumb {
  width: 100%;
  height: 100%;
  display: block;
  background-color: #f3f4f6;
}

.media-video {
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, #ede9fe 0%, #ddd6fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-video-badge {
  font-size: 22rpx;
  font-weight: 800;
  color: #6d28d9;
}

.media-remove {
  position: absolute;
  top: 12rpx;
  right: 12rpx;
  width: 44rpx;
  height: 44rpx;
  border-radius: 22rpx;
  background-color: rgba(17, 24, 39, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-remove-text {
  font-size: 28rpx;
  color: #ffffff;
  line-height: 1;
}

.media-add {
  width: 100%;
  height: 144rpx;
  border-radius: 28rpx;
  border: 3rpx dashed #d1d5db;
  background-color: #f8fafc;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  box-sizing: border-box;
}

.media-add-icon {
  width: 44rpx;
  height: 44rpx;
}

.media-add-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #6b7280;
}

.short-chat-footer {
  flex-shrink: 0;
  padding: 24rpx 40rpx calc(32rpx + env(safe-area-inset-bottom, 0px));
  background: linear-gradient(
    180deg,
    rgba(244, 245, 247, 0) 0%,
    rgba(244, 245, 247, 0.85) 28%,
    #f4f5f7 55%
  );
  box-sizing: border-box;
}

.confirm-btn {
  height: 104rpx;
  border-radius: 1998rpx;
  background-color: rgba(159, 232, 112, 0.38);
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-btn.active {
  background-color: #9fe870;
}

.confirm-btn-text {
  font-size: 32rpx;
  font-weight: 700;
  color: rgba(22, 51, 0, 0.45);
  line-height: 1;
}

.confirm-btn.active .confirm-btn-text {
  color: #163300;
}

@keyframes short-chat-mask-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes short-chat-mask-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes short-chat-slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes short-chat-slide-down {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}
</style>
