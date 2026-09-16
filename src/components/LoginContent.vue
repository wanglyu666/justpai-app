<template>
  <AuthSuccessLayer
    :faded="successFaded"
    :hello-visible="successHelloVisible"
    :welcome-visible="successWelcomeVisible"
  >
    <view class="login-page">
    <view class="page-header">
      <view class="icon-btn" @click="handleBack">
        <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="header-icon" />
      </view>
    </view>

    <text class="login-title">登录</text>

    <view class="login-body">
      <view class="field-group">
        <text class="field-label">请输入手机号</text>
        <view class="input-pill">
          <view class="country-code">
            <text class="country-code-text">+86</text>
            <text class="country-caret">▾</text>
          </view>
          <input
            class="field-input"
            type="number"
            maxlength="11"
            v-model="phone"
            placeholder="请输入手机号"
            placeholder-class="field-placeholder"
          />
          <image
            v-if="isPhoneValid"
            src="/static/icons/check.svg"
            mode="aspectFit"
            class="field-check"
          />
        </view>
      </view>

      <view class="password-slot" :class="{ collapsed: codeMode }">
        <view class="field-group">
          <text class="field-label">请输入密码</text>
          <view class="input-pill">
            <input
              class="field-input"
              :password="!showPassword"
              v-model="password"
              placeholder="请输入密码"
              placeholder-class="field-placeholder"
            />
            <view class="eye-btn" @click.stop="showPassword = !showPassword">
              <image
                :src="showPassword ? '/static/icons/eye-off.svg' : '/static/icons/eye.svg'"
                mode="aspectFit"
                class="eye-icon"
              />
            </view>
          </view>
          <text v-if="passwordError" class="auth-error">{{ passwordError }}</text>
          <text class="forgot-link" @click="onForgotPassword">忘记密码？</text>
        </view>
      </view>

      <view
        class="login-btn"
        :class="{ 'is-disabled': !canSubmit }"
        @click="onPrimary"
      >
        <text class="login-btn-text">{{ codeMode ? '下一步' : '登录' }}</text>
      </view>

      <view class="signup-row">
        <text class="signup-hint">还没有账号？</text>
        <text class="signup-link" @click="onSignUp">注册</text>
      </view>

      <text class="divider-or">或</text>

      <view class="social-btn" @click="onToggleCodeMode">
        <image
          :key="codeMode ? 'password' : 'code'"
          :src="codeMode ? '/static/icons/eye.svg' : '/static/icons/message-circle.svg'"
          mode="aspectFit"
          class="social-icon"
          :class="{ 'social-icon-password': codeMode }"
        />
        <text class="social-text">{{ codeMode ? '通过 密码 继续' : '通过 验证码 继续' }}</text>
      </view>

      <view class="social-btn" @click="onSocial('微信')">
        <image src="/static/icons/wechatgreen.svg" mode="aspectFit" class="social-icon social-icon-wechat" />
        <text class="social-text">通过 微信 继续</text>
      </view>

      <text class="divider-or">或</text>

      <text class="guest-link" @click="onGuest">游客登录</text>
    </view>
    </view>
  </AuthSuccessLayer>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import AuthSuccessLayer from '@/components/AuthSuccessLayer.vue';
import { useAuthSuccessSequence } from '@/composables/useAuthSuccessSequence';
import { usePageBack } from '@/composables/usePageBack';

const emit = defineEmits<{
  back: [];
  done: [];
  otp: [phone: string];
}>();

const {
  faded: successFaded,
  helloVisible: successHelloVisible,
  welcomeVisible: successWelcomeVisible,
  play: playSuccess,
} = useAuthSuccessSequence();
const phone = ref('');
const password = ref('');
const showPassword = ref(false);
const codeMode = ref(false);
const passwordError = ref('');
const submitting = ref(false);

const isPhoneValid = computed(() => /^1\d{10}$/.test(phone.value.trim()));
const canSubmit = computed(() => {
  if (submitting.value) return false;
  if (!isPhoneValid.value) return false;
  if (!codeMode.value && !password.value.trim()) return false;
  return true;
});

const handleBack = usePageBack(() => emit('back'));

const toast = (title: string) => {
  uni.showToast({ title, icon: 'none' });
};

const onPrimary = async () => {
  if (!canSubmit.value) return;
  if (codeMode.value) {
    emit('otp', phone.value.trim());
    return;
  }
  if (password.value !== '2222') {
    passwordError.value = '密码不正确，请重新输入';
    return;
  }
  submitting.value = true;
  passwordError.value = '';
  await playSuccess();
  emit('done');
};

const onForgotPassword = () => {
  toast('忘记密码功能开发中');
};

const onSignUp = () => {
  toast('注册功能开发中');
};

const onToggleCodeMode = () => {
  passwordError.value = '';
  codeMode.value = !codeMode.value;
};

const onSocial = (name: string) => {
  toast(`${name} 登录开发中`);
};

const onGuest = () => {
  emit('done');
};

watch(password, () => {
  passwordError.value = '';
});
</script>

<style scoped>
.login-page {
  min-height: calc(100% + var(--page-safe-top));
  margin-top: calc(-1 * var(--page-safe-top));
  padding-top: var(--page-safe-top);
  background-color: #ffffff;
  box-sizing: border-box;
  padding-bottom: 80rpx;
  display: flex;
  flex-direction: column;
}

.page-header {
  padding: 0 48rpx;
}

.icon-btn {
  width: 88rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background-color: #f4f5f7;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
}

.header-icon {
  width: 40rpx;
  height: 40rpx;
}

.login-title {
  display: block;
  text-align: center;
  font-size: 56rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
  margin-top: 12rpx;
}

.login-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48rpx 64rpx 40rpx;
}

.field-group {
  margin-bottom: 36rpx;
}

.password-slot {
  overflow: hidden;
  max-height: 320rpx;
  opacity: 1;
  transform: translateY(0);
  transition:
    max-height 320ms ease,
    opacity 240ms ease,
    transform 320ms ease;
}

.password-slot.collapsed {
  max-height: 0;
  opacity: 0;
  transform: translateY(-16rpx);
}

.field-label {
  display: block;
  font-size: 28rpx;
  color: #6b7280;
  margin-bottom: 16rpx;
}

.input-pill {
  height: 104rpx;
  border-radius: 1998rpx;
  border: 2rpx solid #e5e7eb;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  padding: 0 28rpx;
  box-sizing: border-box;
}

.country-code {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding-right: 20rpx;
  margin-right: 16rpx;
  border-right: 2rpx solid #e5e7eb;
  flex-shrink: 0;
}

.country-code-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #111827;
}

.country-caret {
  font-size: 20rpx;
  color: #9ca3af;
  line-height: 1;
}

.field-input {
  flex: 1;
  min-width: 0;
  height: 100%;
  font-size: 30rpx;
  color: #111827;
}

.field-placeholder {
  color: #9ca3af;
  font-size: 28rpx;
}

.field-check {
  width: 36rpx;
  height: 36rpx;
  flex-shrink: 0;
  margin-left: 12rpx;
}

.eye-btn {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.eye-icon {
  width: 40rpx;
  height: 40rpx;
}

.forgot-link {
  display: block;
  text-align: right;
  margin-top: 16rpx;
  font-size: 26rpx;
  color: #111827;
  font-weight: 600;
}

.login-btn {
  height: 104rpx;
  border-radius: 1998rpx;
  background-color: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12rpx;
  transition: opacity 200ms ease;
}

.login-btn.is-disabled {
  opacity: 0.28;
}

.auth-error {
  display: block;
  text-align: center;
  margin-top: 16rpx;
  font-size: 26rpx;
  font-weight: 600;
  color: #dc2626;
}

.login-btn-text {
  font-size: 32rpx;
  font-weight: 800;
  color: #ffffff;
}

.signup-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  margin-top: 28rpx;
}

.signup-hint {
  font-size: 26rpx;
  color: #9ca3af;
}

.signup-link {
  font-size: 26rpx;
  font-weight: 800;
  color: #111827;
}

.divider-or {
  display: block;
  text-align: center;
  margin: 28rpx 0;
  font-size: 26rpx;
  color: #9ca3af;
}

.social-btn {
  height: 104rpx;
  border-radius: 1998rpx;
  border: 2rpx solid #e5e7eb;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  margin-bottom: 20rpx;
  box-sizing: border-box;
}

.social-icon {
  width: 40rpx;
  height: 40rpx;
}

.social-icon-password {
  filter: brightness(0);
}

.social-icon-wechat {
  width: 48rpx;
  height: 48rpx;
}

.social-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #111827;
}

.guest-link {
  display: block;
  text-align: center;
  font-size: 26rpx;
  color: #9ca3af;
  text-decoration: underline;
}
</style>
