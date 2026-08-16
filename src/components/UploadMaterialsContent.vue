<template>
  <view class="upload-materials">
    <view class="page-header">
      <view class="icon-btn" @click="handleBack">
        <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="header-icon-img"></image>
      </view>
    </view>

    <view class="content">
      <text class="page-title">升级企业账号</text>
      <text class="page-desc">上传营业执照并填写开票信息，提交后将进入企业账号审核流程</text>

      <view class="section">
        <text class="field-label">营业执照</text>
        <view class="upload-box" @click="handleChooseImage">
          <image
            v-if="licenseImage"
            :src="licenseImage"
            mode="aspectFill"
            class="upload-preview"
          ></image>
          <view v-else class="upload-placeholder">
            <image src="/static/icons/image-plus.svg" mode="aspectFit" class="upload-icon"></image>
            <text class="upload-text">点击上传营业执照</text>
            <text class="upload-hint">支持 JPG、PNG 等图片格式</text>
          </view>
        </view>
      </view>

      <view class="section">
        <text class="section-title">开票信息</text>

        <view class="form-list">
          <view class="field-group">
            <text class="field-label">企业全称</text>
            <input
              v-model="form.companyName"
              class="field-input"
              placeholder="请输入企业全称"
              placeholder-class="input-placeholder"
            />
          </view>

          <view class="field-group">
            <text class="field-label">统一信用代码</text>
            <input
              v-model="form.creditCode"
              class="field-input"
              placeholder="请输入统一信用代码"
              placeholder-class="input-placeholder"
            />
          </view>

          <view class="field-group">
            <text class="field-label">注册地址</text>
            <input
              v-model="form.registerAddress"
              class="field-input"
              placeholder="请输入注册地址"
              placeholder-class="input-placeholder"
            />
          </view>

          <view class="field-group">
            <text class="field-label">注册电话</text>
            <input
              v-model="form.registerPhone"
              class="field-input"
              placeholder="请输入注册电话"
              placeholder-class="input-placeholder"
            />
          </view>

          <view class="field-group">
            <text class="field-label">开户行</text>
            <input
              v-model="form.bankName"
              class="field-input"
              placeholder="请输入开户行"
              placeholder-class="input-placeholder"
            />
          </view>

          <view class="field-group">
            <text class="field-label">银行账号</text>
            <input
              v-model="form.bankAccount"
              class="field-input"
              placeholder="请输入银行账号"
              placeholder-class="input-placeholder"
            />
          </view>
        </view>
      </view>

      <view class="submit-wrap">
        <view class="submit-btn" :class="{ active: isConfirmEnabled }" @click="handleConfirm">
          <text class="submit-text">确认</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { usePageBack } from '@/composables/usePageBack';

const emit = defineEmits<{
  back: [];
  next: [];
}>();

const licenseImage = ref('');

const form = reactive({
  companyName: '',
  creditCode: '',
  registerAddress: '',
  registerPhone: '',
  bankName: '',
  bankAccount: '',
});

const isConfirmEnabled = computed(() =>
  licenseImage.value !== ''
  && form.companyName.trim() !== ''
  && form.creditCode.trim() !== ''
  && form.registerAddress.trim() !== ''
  && form.registerPhone.trim() !== ''
  && form.bankName.trim() !== ''
  && form.bankAccount.trim() !== '',
);

const handleBack = usePageBack(() => emit('back'));

const handleChooseImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      licenseImage.value = res.tempFilePaths[0] ?? '';
    },
  });
};

const handleConfirm = () => {
  if (!isConfirmEnabled.value) return;
  emit('next');
};
</script>

<style scoped>
.upload-materials {
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
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #6b7280;
  line-height: 1.5;
}

.section {
  margin-top: 56rpx;
}

.section-title {
  display: block;
  font-size: 40rpx;
  font-weight: 800;
  color: #111827;
  margin-bottom: 32rpx;
}

.field-label {
  display: block;
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.4;
  margin-bottom: 16rpx;
}

.upload-box {
  width: 100%;
  height: 320rpx;
  border-radius: 32rpx;
  border: 2rpx dashed #d1d5db;
  background-color: #ffffff;
  overflow: hidden;
  box-sizing: border-box;
}

.upload-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
}

.upload-icon {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 8rpx;
}

.upload-text {
  font-size: 28rpx;
  color: #6b7280;
}

.upload-hint {
  font-size: 24rpx;
  color: #9ca3af;
}

.upload-preview {
  width: 100%;
  height: 100%;
}

.form-list {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.field-input {
  width: 100%;
  height: 96rpx;
  padding: 0 28rpx;
  background-color: #ffffff;
  border: 2rpx solid #e5e7eb;
  border-radius: 24rpx;
  font-size: 28rpx;
  color: #111827;
  box-sizing: border-box;
}

.input-placeholder {
  color: #d1d5db;
  font-size: 28rpx;
}

.submit-wrap {
  padding: 64rpx 0 0;
}

.submit-btn {
  width: 100%;
  height: 104rpx;
  border-radius: 52rpx;
  background-color: rgba(159, 232, 112, 0.38);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, opacity 0.2s ease;
}

.submit-btn.active {
  background-color: #9fe870;
}

.submit-text {
  font-size: 32rpx;
  font-weight: 700;
  color: rgba(22, 51, 0, 0.45);
  transition: color 0.2s ease;
}

.submit-btn.active .submit-text {
  color: #163300;
}
</style>
