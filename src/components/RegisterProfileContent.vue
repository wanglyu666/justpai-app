<template>
  <AuthSuccessLayer
    :faded="successFaded"
    :hello-visible="successHelloVisible"
    :welcome-visible="successWelcomeVisible"
  >
    <view class="profile-page">
      <view class="page-header">
        <view class="icon-btn" @click="handleBack">
          <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="header-icon" />
        </view>
        <text class="page-title">注册</text>
        <view class="header-spacer" />
      </view>

      <view class="profile-body">
        <view class="profile-cluster">
        <view class="profile-copy">
          <text class="profile-heading">完善资料</text>
          <text class="profile-hint">填写昵称、邮箱并设置登录密码</text>
        </view>

        <view class="profile-form">
          <view class="field-group">
            <text class="field-label">昵称</text>
            <view class="input-pill">
              <input
                class="field-input"
                type="text"
                v-model="nickname"
                placeholder="请输入昵称"
                placeholder-class="field-placeholder"
              />
            </view>
          </view>

          <view class="field-group">
            <text class="field-label">邮箱</text>
            <view class="input-pill">
              <input
                class="field-input"
                type="text"
                v-model="email"
                placeholder="请输入邮箱"
                placeholder-class="field-placeholder"
              />
            </view>
          </view>

          <view class="field-group">
            <text class="field-label">设置密码</text>
            <view class="input-pill">
              <input
                class="field-input"
                :class="{ 'field-input-masked': !showPassword && Boolean(password) }"
                type="text"
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
            <text class="field-rule">密码需要8位及以上</text>
          </view>

          <view class="field-group">
            <text class="field-label">确认密码</text>
            <view class="input-pill">
              <input
                class="field-input"
                :class="{ 'field-input-masked': !showConfirm && Boolean(confirmPassword) }"
                type="text"
                v-model="confirmPassword"
                placeholder="请再次输入密码"
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
            <text class="confirm-btn-text">确认</text>
          </view>
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

const nickname = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirm = ref(false);
const formError = ref('');
const submitting = ref(false);

const isEmailValid = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const canSubmit = computed(
  () =>
    Boolean(nickname.value.trim()) &&
    Boolean(email.value.trim()) &&
    Boolean(password.value.trim()) &&
    Boolean(confirmPassword.value.trim()) &&
    !submitting.value,
);

const handleBack = usePageBack(() => emit('back'));

const onConfirm = async () => {
  if (!canSubmit.value) return;
  if (!nickname.value.trim()) {
    formError.value = '请输入昵称';
    return;
  }
  if (!isEmailValid(email.value)) {
    formError.value = '请输入正确的邮箱';
    return;
  }
  if (password.value.length < 8) {
    formError.value = '密码不符合要求，请输入8位及以上';
    return;
  }
  if (password.value !== confirmPassword.value) {
    formError.value = '两次密码不一致，请重新输入';
    return;
  }
  formError.value = '';
  submitting.value = true;
  await playSuccess();
  emit('done');
};

watch([nickname, email, password, confirmPassword], () => {
  formError.value = '';
});
</script>

<style scoped>
.profile-page {
  position: relative;
  min-height: calc(100% + var(--page-safe-top));
  height: calc(100% + var(--page-safe-top));
  margin-top: calc(-1 * var(--page-safe-top));
  background-color: #ffffff;
  box-sizing: border-box;
}

.page-header {
  position: absolute;
  top: var(--page-safe-top);
  left: 0;
  right: 0;
  padding: 0 48rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
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

.profile-body {
  position: absolute;
  top: 0;
  right: 0;
  bottom: var(--page-safe-top);
  left: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.profile-cluster {
  margin: auto 0;
}

.profile-copy {
  padding: 0 48rpx;
  text-align: center;
}

.profile-heading {
  display: block;
  font-size: 48rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
}

.profile-hint {
  display: block;
  margin-top: 16rpx;
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.5;
}

.profile-form {
  padding: 48rpx 48rpx 0;
}

.field-group {
  margin-bottom: 28rpx;
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
  margin: -4rpx 0 24rpx;
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
