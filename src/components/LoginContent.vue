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

    <text class="login-title">{{ t('auth.login') }}</text>

    <view class="login-body">
      <view class="field-group">
        <text class="field-label">{{ t('auth.phoneLabel') }}</text>
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
            :placeholder="t('auth.phoneLabel')"
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
          <text class="field-label">{{ t('auth.passwordLabel') }}</text>
          <view class="input-pill">
            <input
              class="field-input"
              :class="{ 'field-input-masked': !showPassword && Boolean(password) }"
              type="text"
              v-model="password"
              :placeholder="t('auth.passwordLabel')"
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
          <text class="forgot-link" @click="onForgotPassword">{{ t('auth.forgotPassword') }}</text>
        </view>
      </view>

      <view
        class="login-btn"
        :class="{ 'is-disabled': !canSubmit }"
        @click="onPrimary"
      >
        <text class="login-btn-text">{{ codeMode ? t('auth.next') : t('auth.login') }}</text>
      </view>

      <view class="signup-row">
        <text class="signup-hint">{{ t('auth.noAccount') }}</text>
        <text class="signup-link" @click="onSignUp">{{ t('auth.register') }}</text>
      </view>

      <view class="divider-or" />

      <view class="social-btn" @click="onToggleCodeMode">
        <image
          :key="codeMode ? 'password' : 'code'"
          :src="codeMode ? '/static/icons/eye.svg' : '/static/icons/message-circle.svg'"
          mode="aspectFit"
          class="social-icon"
          :class="{ 'social-icon-password': codeMode }"
        />
        <text class="social-text">{{ codeMode ? t('auth.continuePassword') : t('auth.continueCode') }}</text>
      </view>

      <view class="social-btn" @click="onSocial">
        <image src="/static/icons/wechatgreen.svg" mode="aspectFit" class="social-icon social-icon-wechat" />
        <text class="social-text">{{ t('auth.continueWechat') }}</text>
      </view>

      <view class="divider-or" />

      <text class="guest-link" @click="onGuest">{{ t('auth.guestLogin') }}</text>
    </view>
    </view>
  </AuthSuccessLayer>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import AuthSuccessLayer from '@/components/AuthSuccessLayer.vue';
import { useAuthSuccessSequence } from '@/composables/useAuthSuccessSequence';
import { usePageBack } from '@/composables/usePageBack';
import { useLanguage } from '@/composables/useLanguage';

const { t } = useLanguage();

const emit = defineEmits<{
  back: [];
  done: [];
  otp: [phone: string];
  forgot: [phone: string];
  signup: [phone: string];
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
    passwordError.value = t('auth.incorrectPassword');
    return;
  }
  submitting.value = true;
  passwordError.value = '';
  await playSuccess();
  emit('done');
};

const onForgotPassword = () => {
  emit('forgot', phone.value.trim());
};

const onSignUp = () => {
  emit('signup', phone.value.trim());
};

const onToggleCodeMode = () => {
  passwordError.value = '';
  codeMode.value = !codeMode.value;
};

const onSocial = () => {
  toast(t('auth.wechatLoginInDevelopment'));
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

input.field-input-masked:not(:placeholder-shown),
.field-input-masked :deep(input:not(:placeholder-shown)),
.field-input-masked :deep(.uni-input-input:not(:placeholder-shown)) {
  -webkit-text-security: disc;
  text-security: disc;
}

.input-pill :deep(input)::-ms-reveal,
.input-pill :deep(input)::-ms-clear,
.field-input::-ms-reveal,
.field-input::-ms-clear {
  display: none;
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
  height: 26rpx;
  margin: 28rpx 0;
  flex-shrink: 0;
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
