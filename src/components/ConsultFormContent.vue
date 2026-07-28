<template>
  <view class="consult-form">
    <view class="page-header">
      <view class="icon-btn" @click="handleBack">
        <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="header-icon" />
      </view>
      <text class="page-title">咨询</text>
      <text class="page-desc">填写服务信息后提交，顾问将尽快与您联系</text>
    </view>

    <view class="form-scroll-wrap">
      <view class="form-scroll-mask form-scroll-mask-top" />
      <view class="form-scroll">
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
        <text class="section-hint">可选，支持上传图片辅助说明</text>

        <view
          v-if="!attachmentPreview"
          class="upload-box"
          @click="handleChooseFile"
        >
          <image src="/static/icons/image-plus.svg" mode="aspectFit" class="upload-icon" />
          <text class="upload-title">选取文件</text>
          <text class="upload-hint">点击上传 JPG、PNG 等图片</text>
        </view>

        <view v-else class="upload-preview-wrap">
          <image :src="attachmentPreview" mode="aspectFill" class="upload-preview" />
          <view class="upload-preview-actions">
            <view class="preview-action preview-action-light" @click="handleChooseFile">
              <text class="preview-action-text">更换</text>
            </view>
            <view class="preview-action preview-action-solid" @click="clearAttachment">
              <text class="preview-action-text">移除</text>
            </view>
          </view>
        </view>
      </view>
      </view>
      <view class="form-scroll-mask form-scroll-mask-bottom" />
    </view>

    <view class="submit-footer">
      <view class="submit-btn" :class="{ active: isSubmitEnabled }" @click="handleSubmit">
        <text class="submit-text">提交</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';

const emit = defineEmits<{
  back: [];
  next: [];
}>();

const form = reactive({
  address: '',
  content: '',
});

const attachmentPreview = ref('');

const isSubmitEnabled = computed(() =>
  form.address.trim() !== '' && form.content.trim() !== '',
);

const handleBack = () => {
  emit('back');
};

const handleChooseFile = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      attachmentPreview.value = res.tempFilePaths[0] ?? '';
    },
  });
};

const clearAttachment = () => {
  attachmentPreview.value = '';
};

const handleSubmit = () => {
  if (!isSubmitEnabled.value) return;
  emit('next');
};
</script>

<style scoped>
.consult-form {
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.page-header {
  padding: 0 24px 8px;
  flex-shrink: 0;
}

.icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-icon {
  width: 20px;
  height: 20px;
}

.page-title {
  display: block;
  margin-top: 16px;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.35;
}

.page-desc {
  display: block;
  margin-top: 8px;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.form-scroll-wrap {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.form-scroll {
  height: 100%;
  padding: 12px 24px 8px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
}

.form-scroll-mask {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 2;
  pointer-events: none;
}

.form-scroll-mask-top {
  top: 0;
  height: 36px;
  background: linear-gradient(
    to bottom,
    #f4f5f7 0%,
    rgba(244, 245, 247, 0.85) 35%,
    rgba(244, 245, 247, 0.35) 70%,
    rgba(244, 245, 247, 0) 100%
  );
}

.form-scroll-mask-bottom {
  bottom: 0;
  height: 36px;
  background: linear-gradient(
    to top,
    #f4f5f7 0%,
    rgba(244, 245, 247, 0.85) 35%,
    rgba(244, 245, 247, 0.35) 70%,
    rgba(244, 245, 247, 0) 100%
  );
}

.section-card {
  background-color: #ffffff;
  border-radius: 24px;
  padding: 20px 18px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.04);
}

.section-title {
  display: block;
  font-size: 17px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 16px;
}

.section-hint {
  display: block;
  margin-top: -8px;
  margin-bottom: 14px;
  font-size: 13px;
  color: #9ca3af;
  line-height: 1.4;
}

.field-group {
  margin-bottom: 16px;
}

.field-group:last-child {
  margin-bottom: 0;
}

.field-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.field-label {
  display: block;
  font-size: 13px;
  color: #9ca3af;
  line-height: 1.4;
  margin-bottom: 8px;
}

.field-label-row .field-label {
  margin-bottom: 0;
}

.field-count {
  font-size: 12px;
  color: #9ca3af;
}

.required {
  color: #ef4444;
  margin-right: 2px;
}

.field-input {
  width: 100%;
  height: 48px;
  padding: 0 14px;
  background-color: #f8faf9;
  border: 1px solid #eef0ea;
  border-radius: 14px;
  font-size: 14px;
  color: #111827;
  box-sizing: border-box;
}

.field-textarea {
  width: 100%;
  min-height: 132px;
  padding: 12px 14px;
  background-color: #f8faf9;
  border: 1px solid #eef0ea;
  border-radius: 14px;
  font-size: 14px;
  color: #111827;
  line-height: 1.55;
  box-sizing: border-box;
}

.input-placeholder {
  color: #d1d5db;
  font-size: 14px;
}

.contact-grid {
  display: flex;
  align-items: stretch;
  background-color: #f8faf9;
  border-radius: 16px;
  padding: 16px 8px;
}

.contact-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.contact-divider {
  width: 1px;
  align-self: stretch;
  background-color: #e5e7eb;
  margin: 2px 0;
}

.contact-label {
  font-size: 12px;
  color: #9ca3af;
}

.contact-value {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
}

.upload-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 132px;
  border-radius: 16px;
  border: 1.5px dashed #d1d5db;
  background-color: #f8faf9;
}

.upload-icon {
  width: 36px;
  height: 36px;
  margin-bottom: 4px;
}

.upload-title {
  font-size: 14px;
  font-weight: 700;
  color: #163300;
}

.upload-hint {
  font-size: 12px;
  color: #9ca3af;
}

.upload-preview-wrap {
  border-radius: 16px;
  overflow: hidden;
  background-color: #f8faf9;
}

.upload-preview {
  width: 100%;
  height: 160px;
  display: block;
}

.upload-preview-actions {
  display: flex;
  gap: 10px;
  padding: 12px;
}

.preview-action {
  flex: 1;
  height: 36px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-action-light {
  background-color: rgba(159, 232, 112, 0.45);
}

.preview-action-solid {
  background-color: #9fe870;
}

.preview-action-text {
  font-size: 13px;
  font-weight: 700;
  color: #163300;
}

.submit-footer {
  flex-shrink: 0;
  padding: 16px 24px calc(16px + env(safe-area-inset-bottom, 0px));
  background: linear-gradient(180deg, rgba(244, 245, 247, 0) 0%, #f4f5f7 30%);
  box-sizing: border-box;
}

.submit-btn {
  height: 52px;
  border-radius: 26px;
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
  font-size: 16px;
  font-weight: 700;
  color: rgba(22, 51, 0, 0.45);
  transition: color 0.2s ease;
}

.submit-btn.active .submit-text {
  color: #163300;
}
</style>
