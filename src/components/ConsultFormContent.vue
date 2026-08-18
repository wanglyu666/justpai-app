<template>
  <SheetPageLayout
    title="咨询"
    desc="填写服务信息后提交，顾问将尽快与您联系"
    @back="handleBack"
  >
    <view class="section-card">
      <text class="section-title">咨询信息</text>

      <view class="field-group">
        <text class="field-label">
          <text class="required">*</text>
          服务地址
        </text>
        <input
          v-model="form.address"
          class="field-input"
          placeholder="请输入服务地址"
          placeholder-class="input-placeholder"
        />
      </view>

      <view class="field-group">
        <view class="field-label-row">
          <text class="field-label">
            <text class="required">*</text>
            交流内容
          </text>
          <text class="field-count">{{ form.content.length }}/500</text>
        </view>
        <textarea
          v-model="form.content"
          class="field-textarea"
          placeholder="请描述您的需求或问题，便于我们更快响应"
          placeholder-class="input-placeholder"
          :maxlength="500"
        />
      </view>
    </view>

    <view class="section-card">
      <text class="section-title">联系信息</text>
      <view class="contact-grid">
        <view class="contact-item">
          <text class="contact-label">联系人</text>
          <text class="contact-value">管理员</text>
        </view>
        <view class="contact-divider" />
        <view class="contact-item">
          <text class="contact-label">联系电话</text>
          <text class="contact-value">138-0013-8000</text>
        </view>
      </view>
    </view>

    <view class="section-card">
      <text class="section-title">交流附件</text>
      <text class="section-hint">最多上传 {{ MAX_MEDIA }} 个文件（{{ mediaFiles.length }}/{{ MAX_MEDIA }}）</text>

      <view class="media-grid">
        <view
          v-for="(file, index) in mediaFiles"
          :key="`${file.path}-${index}`"
          class="media-item"
        >
          <image
            :src="file.path"
            mode="aspectFill"
            class="media-thumb"
          />
          <view class="media-remove" @click.stop="removeMedia(index)">
            <text class="media-remove-text">×</text>
          </view>
        </view>

        <view
          v-if="mediaFiles.length < MAX_MEDIA"
          class="media-add"
          :class="{ 'media-add-alone': mediaFiles.length === 0 }"
          @click="handleChooseMedia"
        >
          <image
            src="/static/icons/image-plus.svg"
            mode="aspectFit"
            class="media-add-icon"
          />
          <text class="media-add-text">添加</text>
        </view>
      </view>
    </view>

    <template #footer>
      <view
        class="submit-btn"
        :class="{ active: isSubmitEnabled }"
        @click="handleSubmit"
      >
        <text class="submit-text">提交</text>
      </view>
    </template>
  </SheetPageLayout>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import SheetPageLayout from '@/components/SheetPageLayout.vue';

type MediaFile = {
  path: string;
  name: string;
};

const MAX_MEDIA = 4;

const emit = defineEmits<{
  back: [];
  next: [];
}>();

const form = reactive({
  address: '',
  content: '',
});

const mediaFiles = ref<MediaFile[]>([]);

const isSubmitEnabled = computed(() =>
  form.address.trim() !== '' && form.content.trim() !== '',
);

const handleBack = () => {
  emit('back');
};

const handleChooseMedia = () => {
  const remain = MAX_MEDIA - mediaFiles.value.length;
  if (remain <= 0) return;

  const chooseMediaApi = (uni as any).chooseMedia as typeof uni.chooseMedia | undefined;

  if (typeof chooseMediaApi === 'function') {
    chooseMediaApi({
      count: remain,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const next = res.tempFiles.map((file) => {
          const path = file.tempFilePath;
          const name = path.split('/').pop() || 'image.jpg';
          return { path, name };
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

const chooseImagesFallback = (remain: number) => {
  uni.chooseImage({
    count: remain,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const next = res.tempFilePaths.map((path) => ({
        path,
        name: path.split('/').pop() || 'image.jpg',
      }));
      mediaFiles.value = [...mediaFiles.value, ...next].slice(0, MAX_MEDIA);
    },
  });
};

const removeMedia = (index: number) => {
  mediaFiles.value = mediaFiles.value.filter((_, i) => i !== index);
};

const handleSubmit = () => {
  if (!isSubmitEnabled.value) return;
  emit('next');
};
</script>

<style scoped>
.section-card {
  background-color: #ffffff;
  border-radius: 48rpx;
  padding: 40rpx 36rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 4rpx 24rpx rgba(15, 23, 42, 0.04);
}

.section-title {
  display: block;
  font-size: 34rpx;
  font-weight: 800;
  color: #111827;
  margin-bottom: 32rpx;
}

.section-hint {
  display: block;
  margin-top: -16rpx;
  margin-bottom: 28rpx;
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.4;
}

.field-group {
  margin-bottom: 32rpx;
}

.field-group:last-child {
  margin-bottom: 0;
}

.field-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.field-label {
  display: block;
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.4;
  margin-bottom: 16rpx;
}

.field-label-row .field-label {
  margin-bottom: 0;
}

.field-count {
  font-size: 24rpx;
  color: #9ca3af;
}

.required {
  color: #ef4444;
  margin-right: 4rpx;
}

.field-input {
  width: 100%;
  height: 96rpx;
  padding: 0 28rpx;
  background-color: #f8faf9;
  border: 2rpx solid #eef0ea;
  border-radius: 28rpx;
  font-size: 28rpx;
  color: #111827;
  box-sizing: border-box;
}

.field-textarea {
  width: 100%;
  min-height: 264rpx;
  padding: 24rpx 28rpx;
  background-color: #f8faf9;
  border: 2rpx solid #eef0ea;
  border-radius: 28rpx;
  font-size: 28rpx;
  color: #111827;
  line-height: 1.55;
  box-sizing: border-box;
}

.input-placeholder {
  color: #d1d5db;
  font-size: 28rpx;
}

.contact-grid {
  display: flex;
  align-items: stretch;
  background-color: #f8faf9;
  border-radius: 32rpx;
  padding: 32rpx 16rpx;
}

.contact-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  min-width: 0;
}

.contact-divider {
  width: 2rpx;
  align-self: stretch;
  background-color: #e5e7eb;
  margin: 4rpx 0;
}

.contact-label {
  font-size: 24rpx;
  color: #9ca3af;
}

.contact-value {
  font-size: 28rpx;
  font-weight: 700;
  color: #111827;
}

.media-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.media-item {
  width: calc((100% - 40rpx) / 3);
  aspect-ratio: 1;
  border-radius: 28rpx;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
  background-color: #f3f4f6;
}

.media-thumb {
  width: 100%;
  height: 100%;
  display: block;
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
  width: calc((100% - 40rpx) / 3);
  aspect-ratio: 1;
  border-radius: 28rpx;
  border: 3rpx dashed #d1d5db;
  background-color: #f8faf9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  box-sizing: border-box;
}

.media-add-alone {
  width: 100%;
  aspect-ratio: auto;
  height: 176rpx;
  flex-direction: row;
  gap: 16rpx;
}

.media-add-icon {
  width: 48rpx;
  height: 48rpx;
}

.media-add-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #6b7280;
}

.submit-btn {
  height: 104rpx;
  border-radius: 1998rpx;
  background-color: rgba(159, 232, 112, 0.38);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.submit-btn.active {
  background-color: #9fe870;
}

.submit-text {
  font-size: 32rpx;
  font-weight: 700;
  color: rgba(22, 51, 0, 0.45);
  line-height: 1;
  transition: color 0.2s ease;
}

.submit-btn.active .submit-text {
  color: #163300;
}
</style>
