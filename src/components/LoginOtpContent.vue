<template>
  <AuthSuccessLayer
    :faded="successFaded"
    :hello-visible="successHelloVisible"
    :welcome-visible="successWelcomeVisible"
  >
    <view class="otp-page">
    <view class="page-header">
      <view class="icon-btn" @click="handleBack">
        <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="header-icon" />
      </view>
      <text class="page-title">{{ t('auth.verify') }}</text>
      <view class="header-spacer" />
    </view>

    <view class="otp-hero">
      <image src="/static/images/sms.png" mode="aspectFit" class="otp-hero-image" />
    </view>

    <view class="otp-copy">
      <text class="otp-heading">{{ t('auth.enterCode') }}</text>
      <text class="otp-hint">{{ t('auth.codeSentTo') }}</text>
      <text class="otp-phone">{{ formattedPhone }}</text>
    </view>

    <view class="otp-boxes" :class="{ 'is-shake': shaking }">
      <input
        class="otp-capture"
        type="number"
        maxlength="4"
        :focus="otpFocused"
        :value="otp"
        @input="onOtpInput"
        @blur="otpFocused = false"
      />
      <view
        v-for="index in 4"
        :key="index"
        class="otp-box"
        :class="{
          filled: Boolean(digits[index - 1]),
          active: otp.length === index - 1,
        }"
      >
        <text class="otp-digit">{{ digits[index - 1] || '' }}</text>
      </view>
    </view>

    <text v-if="otpError" class="otp-error">{{ otpError }}</text>

    <view
      class="verify-btn"
      :class="{ 'is-disabled': !canVerify }"
      @click="onVerify"
    >
      <text class="verify-btn-text">{{ t('auth.verify') }}</text>
    </view>

    <text
      class="resend-link"
      :class="{ disabled: countdown > 0 }"
      @click="resendCode"
    >
      {{ resendLabel }}
    </text>
    </view>
  </AuthSuccessLayer>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import AuthSuccessLayer from '@/components/AuthSuccessLayer.vue';
import { useAuthSuccessSequence } from '@/composables/useAuthSuccessSequence';
import { usePageBack } from '@/composables/usePageBack';
import { useLanguage } from '@/composables/useLanguage';

const { t } = useLanguage();

const props = defineProps<{
  phone: string;
  purpose?: 'login' | 'reset' | 'register';
}>();

const emit = defineEmits<{
  back: [];
  done: [];
  reset: [];
  profile: [];
}>();

const {
  faded: successFaded,
  helloVisible: successHelloVisible,
  welcomeVisible: successWelcomeVisible,
  play: playSuccess,
} = useAuthSuccessSequence();
const otp = ref('');
const otpFocused = ref(false);
const otpError = ref('');
const shaking = ref(false);
const submitting = ref(false);
const countdown = ref(0);
let countdownTimer: ReturnType<typeof setInterval> | null = null;
let shakeTimer: ReturnType<typeof setTimeout> | null = null;

const digits = computed(() => otp.value.split(''));
const canVerify = computed(() => otp.value.length === 4 && !submitting.value);

const formattedPhone = computed(() => {
  const digitsOnly = props.phone.replace(/\D/g, '');
  if (digitsOnly.length === 11) {
    return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 7)}-${digitsOnly.slice(7)}`;
  }
  return props.phone || '—';
});

const resendLabel = computed(() => {
  if (countdown.value <= 0) return t('auth.resendCode');
  return `${t('auth.resendCode')} (${countdown.value}s)`;
});

const handleBack = usePageBack(() => emit('back'));

const clearCountdownTimer = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
};

const startCountdown = (seconds = 60) => {
  countdown.value = seconds;
  clearCountdownTimer();
  countdownTimer = setInterval(() => {
    countdown.value -= 1;
    if (countdown.value <= 0) {
      clearCountdownTimer();
    }
  }, 1000);
};

const focusOtp = () => {
  otpFocused.value = false;
  setTimeout(() => {
    otpFocused.value = true;
  }, 30);
};

const onOtpInput = (event: { detail: { value: string } }) => {
  otp.value = String(event.detail.value || '')
    .replace(/\D/g, '')
    .slice(0, 4);
  otpError.value = '';
};

const resendCode = () => {
  if (countdown.value > 0) return;
  startCountdown();
  uni.showToast({ title: t('security.codeSent'), icon: 'none' });
};

const playShake = async () => {
  shaking.value = false;
  await nextTick();
  shaking.value = true;
  if (shakeTimer) clearTimeout(shakeTimer);
  shakeTimer = setTimeout(() => {
    shaking.value = false;
    otpError.value = t('auth.incorrectCode');
    shakeTimer = null;
  }, 420);
};

const onVerify = async () => {
  if (!canVerify.value) return;
  if (otp.value !== '2222') {
    playShake();
    return;
  }
  submitting.value = true;
  otpError.value = '';
  if (props.purpose === 'reset') {
    emit('reset');
    submitting.value = false;
    return;
  }
  if (props.purpose === 'register') {
    emit('profile');
    submitting.value = false;
    return;
  }
  await playSuccess();
  emit('done');
};

onMounted(() => {
  startCountdown();
  focusOtp();
});

onUnmounted(() => {
  clearCountdownTimer();
  if (shakeTimer) clearTimeout(shakeTimer);
});
</script>

<style scoped>
.otp-page {
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
  font-size: 40rpx;
  font-weight: 800;
  color: #111827;
}

.otp-hero {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx 48rpx 0;
}

.otp-hero-image {
  width: 640rpx;
  height: 560rpx;
}

.otp-copy {
  padding: 16rpx 48rpx 0;
  text-align: center;
}

.otp-heading {
  display: block;
  font-size: 48rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
}

.otp-hint {
  display: block;
  margin-top: 16rpx;
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.5;
}

.otp-phone {
  display: block;
  margin-top: 8rpx;
  font-size: 32rpx;
  font-weight: 800;
  color: #111827;
}

.otp-boxes {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 56rpx 48rpx 0;
}

.otp-capture {
  position: absolute;
  left: 48rpx;
  right: 48rpx;
  top: 56rpx;
  height: 140rpx;
  opacity: 0;
  z-index: 2;
}

.otp-box {
  width: 140rpx;
  height: 140rpx;
  border-radius: 32rpx;
  border: 2rpx solid #e5e7eb;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.otp-box.active {
  border-color: #111827;
}

.otp-boxes.is-shake {
  animation: otp-shake 420ms ease;
}

@keyframes otp-shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-16rpx);
  }
  40% {
    transform: translateX(16rpx);
  }
  60% {
    transform: translateX(-10rpx);
  }
  80% {
    transform: translateX(10rpx);
  }
}

.otp-error {
  display: block;
  text-align: center;
  margin-top: 24rpx;
  font-size: 26rpx;
  font-weight: 600;
  color: #dc2626;
}

.otp-digit {
  font-size: 48rpx;
  font-weight: 800;
  color: #111827;
}

.verify-btn {
  height: 104rpx;
  margin: 48rpx 48rpx 0;
  border-radius: 1998rpx;
  background-color: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 200ms ease;
}

.verify-btn.is-disabled {
  opacity: 0.28;
}

.verify-btn-text {
  font-size: 32rpx;
  font-weight: 800;
  color: #ffffff;
}

.resend-link {
  display: block;
  text-align: center;
  margin-top: 28rpx;
  font-size: 26rpx;
  font-weight: 700;
  color: #6b7280;
  text-decoration: underline;
}

.resend-link.disabled {
  color: #9ca3af;
}
</style>
