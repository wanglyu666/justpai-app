<template>
  <view class="forgot-page">
    <view class="page-header">
      <view class="icon-btn" @click="handleBack">
        <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="header-icon" />
      </view>
      <text class="page-title">忘记密码</text>
      <view class="header-spacer" />
    </view>

    <view class="forgot-hero">
      <image src="/static/images/key.png" mode="aspectFit" class="forgot-hero-image" />
    </view>

    <view class="forgot-copy">
      <text class="forgot-heading">忘记密码？</text>
      <text class="forgot-hint">别担心，请输入与该账号绑定的手机号</text>
    </view>

    <view class="forgot-field">
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

    <view
      class="next-btn"
      :class="{ 'is-disabled': !canSubmit }"
      @click="onNext"
    >
      <text class="next-btn-text">下一步</text>
    </view>
    <view class="forgot-footer-spacer" />
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { usePageBack } from '@/composables/usePageBack';

const props = defineProps<{
  phone?: string;
}>();

const emit = defineEmits<{
  back: [];
  otp: [phone: string];
}>();

const phone = ref(props.phone || '');
const isPhoneValid = computed(() => /^1\d{10}$/.test(phone.value.trim()));
const canSubmit = computed(() => isPhoneValid.value);

const handleBack = usePageBack(() => emit('back'));

watch(
  () => props.phone,
  (value) => {
    if (value) phone.value = value;
  },
);

const onNext = () => {
  if (!canSubmit.value) return;
  emit('otp', phone.value.trim());
};
</script>

<style scoped>
.forgot-page {
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

.forgot-hero {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx 48rpx 0;
}

.forgot-hero-image {
  width: 640rpx;
  height: 560rpx;
}

.forgot-copy {
  padding: 16rpx 48rpx 0;
  text-align: center;
}

.forgot-heading {
  display: block;
  font-size: 48rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
}

.forgot-hint {
  display: block;
  margin-top: 16rpx;
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.5;
}

.field-label {
  display: block;
  font-size: 28rpx;
  color: #6b7280;
  margin-bottom: 16rpx;
}

.forgot-field {
  padding: 56rpx 48rpx 0;
}

.input-pill {
  width: 100%;
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

.next-btn {
  height: 104rpx;
  margin: 48rpx 48rpx 0;
  border-radius: 1998rpx;
  background-color: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 200ms ease;
}

.next-btn.is-disabled {
  opacity: 0.28;
}

.next-btn-text {
  font-size: 32rpx;
  font-weight: 800;
  color: #ffffff;
}

.forgot-footer-spacer {
  height: 37rpx;
  margin-top: 28rpx;
}
</style>
