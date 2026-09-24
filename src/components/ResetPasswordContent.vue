<template>
  <AuthSuccessLayer
    :faded="successFaded"
    :hello-visible="successHelloVisible"
    :welcome-visible="successWelcomeVisible"
  >
    <view class="reset-page">
      <view class="page-header">
        <view class="icon-btn" @click="handleBack">
          <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="header-icon" />
        </view>
        <text class="page-title">{{ t('auth.resetPassword') }}</text>
        <view class="header-spacer" />
      </view>

      <view class="reset-body">
      <view class="reset-copy">
        <text class="reset-heading">{{ t('auth.setNewPassword') }}</text>
        <text class="reset-hint">{{ t('auth.setNewPasswordHint') }}</text>
      </view>

      <view class="reset-form">
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
          <text class="field-rule">{{ t('auth.passwordRule') }}</text>
        </view>

        <view class="field-group">
          <text class="field-label">{{ t('auth.repeatPassword') }}</text>
          <view class="input-pill">
            <input
              class="field-input"
              :class="{ 'field-input-masked': !showConfirm && Boolean(confirmPassword) }"
              type="text"
              v-model="confirmPassword"
              :placeholder="t('auth.enterPasswordAgain')"
              placeholder-class="field-placeholder"
            />
            <view class="eye-btn" @click.stop="showConfirm = !showConfirm">
              <image
                :src="showConfirm ? '/static/icons/eye-off.svg' : '/static/icons/eye.svg'"
                mode="aspectFit"
                class="eye-icon"
              />
            </view>
          </view>
        </view>

        <text v-if="formError" class="form-error">{{ formError }}</text>

        <view
          class="confirm-btn"
          :class="{ 'is-disabled': !canSubmit }"
          @click="onConfirm"
        >
          <text class="confirm-btn-text">{{ t('common.confirm') }}</text>
        </view>
      </view>
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
}>();

const {
  faded: successFaded,
  helloVisible: successHelloVisible,
  welcomeVisible: successWelcomeVisible,
  play: playSuccess,
} = useAuthSuccessSequence();

const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirm = ref(false);
const formError = ref('');
const submitting = ref(false);

const canSubmit = computed(
  () => Boolean(password.value.trim()) && Boolean(confirmPassword.value.trim()) && !submitting.value,
);

const handleBack = usePageBack(() => emit('back'));

const onConfirm = async () => {
  if (!canSubmit.value) return;
  if (password.value.length < 8) {
    formError.value = t('auth.invalidPassword');
    return;
  }
  if (password.value !== confirmPassword.value) {
    formError.value = t('auth.passwordMismatch');
    return;
  }
  formError.value = '';
  submitting.value = true;
  await playSuccess();
  emit('done');
};

watch([password, confirmPassword], () => {
  formError.value = '';
});
</script>

<style scoped>
.reset-page {
  min-height: calc(100% + var(--page-safe-top));
  height: calc(100% + var(--page-safe-top));
  margin-top: calc(-1 * var(--page-safe-top));
  padding-top: var(--page-safe-top);
  background-color: #ffffff;
  box-sizing: border-box;
  padding-bottom: 80rpx;
  display: flex;
  flex-direction: column;
}

.page-header {
  position: relative;
  padding: 0 48rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  z-index: 1;
}

.header-icon {
  width: 40rpx;
  height: 40rpx;
}

.header-spacer {
  width: 88rpx;
  height: 88rpx;
}

.page-title {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 40rpx;
  font-weight: 800;
  color: #111827;
  pointer-events: none;
}

.reset-body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.reset-copy {
  padding: 0 48rpx;
  text-align: center;
}

.reset-heading {
  display: block;
  font-size: 48rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
}

.reset-hint {
  display: block;
  margin-top: 16rpx;
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.5;
}

.reset-form {
  padding: 56rpx 48rpx 0;
}

.field-group {
  margin-bottom: 36rpx;
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

.field-rule {
  display: block;
  margin-top: 16rpx;
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.4;
}

.form-error {
  display: block;
  text-align: center;
  margin: -8rpx 0 24rpx;
  font-size: 26rpx;
  font-weight: 600;
  color: #dc2626;
}

.confirm-btn {
  height: 104rpx;
  margin-top: 12rpx;
  border-radius: 1998rpx;
  background-color: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 200ms ease;
}

.confirm-btn.is-disabled {
  opacity: 0.28;
}

.confirm-btn-text {
  font-size: 32rpx;
  font-weight: 800;
  color: #ffffff;
}
</style>
