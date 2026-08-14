<template>
  <view class="password-change">
    <view class="page-header">
      <view class="icon-btn" @click="handleBack">
        <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="back-icon-img"></image>
      </view>
    </view>

    <view class="form-body">
      <text class="form-heading">请输入新的密码</text>
      <text class="form-heading">并再次输入确认</text>

      <view class="form-content">
        <view class="field-group field-group-first">
          <text class="field-label">新密码</text>
          <view class="input-wrap">
            <input
              v-model="newPassword"
              type="text"
              class="field-input"
              :class="{ 'field-input-masked': !showNewPassword }"
              placeholder="请输入新密码"
              placeholder-class="input-placeholder"
              autocomplete="off"
            />
            <view class="eye-btn" @click.stop="toggleNewPassword">
              <image
                :src="showNewPassword ? '/static/icons/eye-off.svg' : '/static/icons/eye.svg'"
                mode="aspectFit"
                class="eye-icon"
              ></image>
            </view>
          </view>
          <text class="field-hint">密码需在9位及以上，包含数字和字母</text>
        </view>

        <view class="field-group">
          <text class="field-label">确认密码</text>
          <view class="input-wrap">
            <input
              v-model="confirmPassword"
              type="text"
              class="field-input"
              :class="{ 'field-input-masked': !showConfirmPassword }"
              placeholder="请再次输入新密码"
              placeholder-class="input-placeholder"
              autocomplete="off"
            />
            <view class="eye-btn" @click.stop="toggleConfirmPassword">
              <image
                :src="showConfirmPassword ? '/static/icons/eye-off.svg' : '/static/icons/eye.svg'"
                mode="aspectFit"
                class="eye-icon"
              ></image>
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
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const emit = defineEmits<{
  back: [];
  next: [];
}>();

const newPassword = ref('');
const confirmPassword = ref('');
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const isPasswordValid = (value: string) => {
  return value.length >= 9 && /[0-9]/.test(value) && /[a-zA-Z]/.test(value);
};

const isConfirmEnabled = computed(() => {
  return (
    isPasswordValid(newPassword.value) &&
    newPassword.value === confirmPassword.value
  );
});

const toggleNewPassword = () => {
  showNewPassword.value = !showNewPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const handleBack = () => {
  emit('back');
};

const handleConfirm = () => {
  if (!isConfirmEnabled.value) return;
  emit('next');
};
</script>

<style scoped>
.password-change {
  min-height: 100%;
  padding-bottom: 80rpx;
  box-sizing: border-box;
}

.page-header {
  padding: 0 48rpx 16rpx;
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

.back-icon-img {
  width: 40rpx;
  height: 40rpx;
}

.form-body {
  padding: 24rpx 48rpx 0;
}

.form-content {
  margin-top: 72rpx;
}

.form-heading {
  display: block;
  font-size: 56rpx;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.35;
}

.field-group {
  margin-top: 56rpx;
}

.field-group-first {
  margin-top: 0;
}

.field-label {
  display: block;
  font-size: 28rpx;
  color: #6b7280;
  margin-bottom: 20rpx;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.field-input {
  flex: 1;
  width: 100%;
  height: 104rpx;
  padding: 0 96rpx 0 32rpx;
  background-color: #ffffff;
  border: 2rpx solid #e5e7eb;
  border-radius: 24rpx;
  font-size: 30rpx;
  color: #111827;
  box-sizing: border-box;
}

.field-input-masked {
  -webkit-text-security: disc;
  text-security: disc;
}

.input-placeholder {
  color: #d1d5db;
  font-size: 30rpx;
}

.eye-btn {
  position: absolute;
  right: 24rpx;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.eye-icon {
  width: 40rpx;
  height: 40rpx;
}

.field-hint {
  display: block;
  margin-top: 20rpx;
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.4;
}

.submit-wrap {
  padding: 144rpx 0 0;
}

.submit-btn {
  height: 104rpx;
  border-radius: 52rpx;
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
  transition: color 0.2s ease;
}

.submit-btn.active .submit-text {
  color: #163300;
}
</style>
