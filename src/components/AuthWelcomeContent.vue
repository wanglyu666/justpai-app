<template>
  <view class="welcome-page">
    <view class="page-header">
      <view class="icon-btn" @click="handleBack">
        <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="header-icon" />
      </view>
    </view>

    <view class="welcome-copy">
      <text class="welcome-title">把工程干对</text>
      <text class="welcome-subtitle">一站式创造与维护您的工作空间</text>
    </view>

    <view class="welcome-visual">
      <swiper
        class="welcome-swiper"
        :indicator-dots="false"
        :current="currentSlide"
        circular
        @change="onSwiperChange"
      >
        <swiper-item v-for="slide in slides" :key="slide.id">
          <image :src="slide.image" mode="widthFix" class="slide-image" />
        </swiper-item>
      </swiper>
    </view>

    <view class="welcome-dots">
      <view
        v-for="(slide, index) in slides"
        :key="slide.id"
        class="welcome-dot"
        :class="{ active: index === currentSlide }"
      />
    </view>

    <view class="welcome-actions">
      <view class="primary-btn" @click="openLogin">
        <text class="primary-btn-text">注册</text>
      </view>
      <view class="secondary-btn" @click="openLogin">
        <text class="secondary-btn-text">登录</text>
      </view>
    </view>

    <SlideOverPanel :show="loginVisible" :z-index="NESTED_PAGE_Z_INDEX" :exit-left="exitLeft">
      <LoginContent
        @back="closeLogin"
        @done="finishAuth"
        @otp="onOpenOtp"
      />
    </SlideOverPanel>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SlideOverPanel from '@/components/SlideOverPanel.vue';
import LoginContent from '@/components/LoginContent.vue';
import { usePageBack } from '@/composables/usePageBack';
import { useSlideOver } from '@/composables/useSlideOver';
import { NESTED_PAGE_Z_INDEX } from '@/utils/pageFadeTransition';

defineProps<{
  exitLeft?: boolean;
}>();

const emit = defineEmits<{
  back: [];
  otp: [phone: string];
  success: [];
}>();

const { visible: loginVisible, open: openLogin, close: closeLogin } = useSlideOver();
const currentSlide = ref(0);

const slides = [
  { id: 1, image: '/static/images/poster1.png' },
  { id: 2, image: '/static/images/poster1.png' },
  { id: 3, image: '/static/images/poster1.png' },
  { id: 4, image: '/static/images/poster1.png' },
  { id: 5, image: '/static/images/poster1.png' },
];

const handleBack = usePageBack(() => emit('back'));

const onSwiperChange = (event: { detail: { current: number } }) => {
  currentSlide.value = event.detail.current;
};

const finishAuth = () => {
  emit('success');
};

const onOpenOtp = (phone: string) => {
  emit('otp', phone);
};
</script>

<style scoped>
.welcome-page {
  height: calc(100% + var(--page-safe-top));
  min-height: calc(100% + var(--page-safe-top));
  margin-top: calc(-1 * var(--page-safe-top));
  padding-top: var(--page-safe-top);
  background-color: #ffffff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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

.welcome-copy {
  padding: 32rpx 64rpx 0;
  text-align: center;
}

.welcome-title {
  display: block;
  font-size: 64rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
  letter-spacing: -1rpx;
}

.welcome-subtitle {
  display: block;
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #9ca3af;
  line-height: 1.5;
}

.welcome-visual {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  overflow: hidden;
  width: 100%;
}

.welcome-swiper {
  width: 144vw;
  margin-left: calc((100% - 144vw) / 2);
  height: 144vw;
  flex-shrink: 0;
}

.welcome-swiper :deep(.uni-swiper-wrapper),
.welcome-swiper :deep(.uni-swiper-slides),
.welcome-swiper :deep(.uni-swiper-slide-frame) {
  width: 100%;
  height: 100%;
}

.slide-image {
  display: block;
  width: 100%;
}

.welcome-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12rpx;
  padding: 8rpx 0 32rpx;
}

.welcome-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background-color: #d1d5db;
}

.welcome-dot.active {
  background-color: #111827;
}

.welcome-actions {
  padding: 0 48rpx calc(40rpx + env(safe-area-inset-bottom));
}

.primary-btn {
  height: 104rpx;
  border-radius: 1998rpx;
  background-color: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
}

.primary-btn-text {
  font-size: 32rpx;
  font-weight: 800;
  color: #ffffff;
}

.secondary-btn {
  height: 104rpx;
  border-radius: 1998rpx;
  border: 2rpx solid #e5e7eb;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20rpx;
  box-sizing: border-box;
}

.secondary-btn-text {
  font-size: 32rpx;
  font-weight: 800;
  color: #111827;
}
</style>
