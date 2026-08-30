<template>
  <view class="acceptance-page">
    <view class="page-header">
      <view class="icon-btn" @click="handleBack">
        <image
          src="/static/icons/chevron-left.svg"
          mode="aspectFit"
          class="header-icon"
        />
      </view>
    </view>

    <view class="page-body">
      <text class="page-title">确认验收</text>
      <FileAttachmentCard :files="files" @preview="onPreviewAttachment" />
    </view>

    <view class="page-footer">
      <view class="confirm-btn" @click="emit('confirm')">
        <text class="confirm-btn-text">确认</text>
      </view>
    </view>

    <view
      v-if="previewVisible"
      class="image-preview"
      @click="closePreview"
    >
      <image
        :src="previewSrc"
        mode="aspectFit"
        class="image-preview-img"
      />
      <view class="preview-close" @click.stop="closePreview">
        <image
          src="/static/icons/x.svg"
          mode="aspectFit"
          class="preview-close-icon"
        />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FileAttachmentCard from '@/components/FileAttachmentCard.vue';
import { usePageBack, usePageBackWhen } from '@/composables/usePageBack';
import { fileKind } from '@/utils/fileDisplay';

const SAMPLE_IMAGE = '/static/images/acceptance-preview.jpg';

withDefaults(
  defineProps<{
    files?: string[];
  }>(),
  {
    files: () => [],
  },
);

const emit = defineEmits<{
  back: [];
  confirm: [];
}>();

const handleBack = usePageBack(() => emit('back'));

const previewVisible = ref(false);
const previewSrc = ref(SAMPLE_IMAGE);

const closePreview = () => {
  previewVisible.value = false;
};

usePageBackWhen(previewVisible, closePreview);

const onPreviewAttachment = (file: string) => {
  if (fileKind(file) !== 'image') return;
  previewSrc.value = SAMPLE_IMAGE;
  previewVisible.value = true;
};
</script>

<style scoped>
.acceptance-page {
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.page-header {
  padding: 0 48rpx;
  flex-shrink: 0;
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
  flex-shrink: 0;
}

.header-icon {
  width: 40rpx;
  height: 40rpx;
}

.page-body {
  flex: 1;
  min-height: 0;
  padding: 48rpx 48rpx 0;
  box-sizing: border-box;
}

.page-title {
  display: block;
  font-size: 56rpx;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.35;
  margin-bottom: 40rpx;
}

.page-footer {
  flex-shrink: 0;
  padding: 32rpx 48rpx calc(32rpx + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
}

.confirm-btn {
  width: 100%;
  height: 104rpx;
  border-radius: 32rpx;
  background-color: #9fe870;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-btn-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #163300;
  line-height: 1;
}

.image-preview {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f4f5f7;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-preview-img {
  width: 100%;
  height: 100%;
}

.preview-close {
  position: absolute;
  top: var(--page-safe-top);
  right: 48rpx;
  width: 88rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  z-index: 2;
}

.preview-close-icon {
  width: 40rpx;
  height: 40rpx;
}
</style>
