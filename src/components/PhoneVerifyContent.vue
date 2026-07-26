<template>
  <view class="phone-verify">
    <view class="page-header">
      <view class="icon-btn" @click="handleBack">
        <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="back-icon-img"></image>
      </view>
    </view>

    <view class="form-body">
      <text class="form-heading">请输入手机验证码</text>
      <text class="form-heading">完成身份验证</text>

      <view class="form-content">
        <view class="field-group field-group-first">
          <text class="field-label">手机号</text>
          <view class="input-wrap">
            <input
              v-model="phone"
              class="field-input field-input-readonly"
              type="number"
              maxlength="11"
              placeholder="请输入手机号"
              placeholder-class="input-placeholder"
              disabled
            />
          </view>
          <text class="field-hint">验证码将发送至您的绑定手机</text>
        </view>

        <view class="field-group">
          <text class="field-label">验证码</text>
          <view class="input-wrap">
            <input
              v-model="verifyCode"
              class="field-input field-input-code"
              type="number"
              maxlength="6"
              placeholder="请输入验证码"
              placeholder-class="input-placeholder"
            />
            <view class="code-btn" :class="{ disabled: countdown > 0 }" @click="sendCode">
              <text class="code-btn-text">{{ countdown > 0 ? `${countdown}s` : '获取验证码' }}</text>
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
import { ref, computed, onUnmounted } from 'vue';

const emit = defineEmits<{
  back: [];
  next: [];
}>();

const phone = ref('13800138000');
const verifyCode = ref('');
const countdown = ref(0);
let countdownTimer: ReturnType<typeof setInterval> | null = null;

const isConfirmEnabled = computed(() => verifyCode.value.length === 6);

const clearCountdownTimer = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
};

const sendCode = () => {
  if (countdown.value > 0) return;

  countdown.value = 60;
  clearCountdownTimer();
  countdownTimer = setInterval(() => {
    countdown.value -= 1;
    if (countdown.value <= 0) {
      clearCountdownTimer();
    }
  }, 1000);

  uni.showToast({
    title: '验证码已发送',
    icon: 'none',
  });
};

const handleBack = () => {
  emit('back');
};

const handleConfirm = () => {
  if (!isConfirmEnabled.value) return;
  emit('next');
};

onUnmounted(() => {
  clearCountdownTimer();
});
</script>

<style scoped>
.phone-verify {
  min-height: 100%;
  padding-bottom: 40px;
  box-sizing: border-box;
}

.page-header {
  padding: 0 24px 8px;
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

.back-icon-img {
  width: 20px;
  height: 20px;
}

.form-body {
  padding: 12px 24px 0;
}

.form-content {
  margin-top: 36px;
}

.form-heading {
  display: block;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.35;
}

.field-group {
  margin-top: 28px;
}

.field-group-first {
  margin-top: 0;
}

.field-label {
  display: block;
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 10px;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.field-input {
  flex: 1;
  height: 52px;
  padding: 0 16px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  color: #111827;
  box-sizing: border-box;
}

.field-input-readonly {
  color: #6b7280;
}

.field-input-code {
  padding-right: 110px;
}

.input-placeholder {
  color: #d1d5db;
  font-size: 15px;
}

.code-btn {
  position: absolute;
  right: 8px;
  min-width: 88px;
  height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.code-btn.disabled {
  opacity: 0.55;
  pointer-events: none;
}

.code-btn-text {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
}

.field-hint {
  display: block;
  margin-top: 10px;
  font-size: 13px;
  color: #9ca3af;
  line-height: 1.4;
}

.submit-wrap {
  padding: 72px 0 0;
}

.submit-btn {
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
