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

const handleBack = () => {
  emit('back');
};

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
  padding-bottom: 40px;
  box-sizing: border-box;
}

.page-header {
  padding: 0 24px;
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

.header-icon-img {
  width: 20px;
  height: 20px;
}

.content {
  padding: 32px 24px 0;
}

.page-title {
  display: block;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.35;
}

.page-desc {
  display: block;
  margin-top: 10px;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.section {
  margin-top: 28px;
}

.section-title {
  display: block;
  font-size: 20px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 16px;
}

.field-label {
  display: block;
  font-size: 13px;
  color: #9ca3af;
  line-height: 1.4;
  margin-bottom: 8px;
}

.upload-box {
  width: 100%;
  height: 160px;
  border-radius: 16px;
  border: 1px dashed #d1d5db;
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
  gap: 8px;
}

.upload-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 4px;
}

.upload-text {
  font-size: 14px;
  color: #6b7280;
}

.upload-hint {
  font-size: 12px;
  color: #9ca3af;
}

.upload-preview {
  width: 100%;
  height: 100%;
}

.form-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field-input {
  width: 100%;
  height: 48px;
  padding: 0 14px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  color: #111827;
  box-sizing: border-box;
}

.input-placeholder {
  color: #d1d5db;
  font-size: 14px;
}

.submit-wrap {
  padding: 32px 0 0;
}

.submit-btn {
  width: 100%;
  height: 52px;
  border-radius: 26px;
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
  font-size: 16px;
  font-weight: 700;
  color: rgba(22, 51, 0, 0.45);
  transition: color 0.2s ease;
}

.submit-btn.active .submit-text {
  color: #163300;
}
</style>
