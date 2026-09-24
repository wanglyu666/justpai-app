<template>
  <view class="welcome-page">
    <view class="page-header">
      <view class="icon-btn" @click="handleBack">
        <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="header-icon" />
      </view>
    </view>

    <view class="welcome-copy">
      <text class="welcome-title">{{ activeSlide.title }}</text>
      <text class="welcome-subtitle">{{ activeSlide.subtitle }}</text>
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
          <view v-if="slide.scene === 'cards'" class="welcome-scene">
            <image
              class="welcome-scene-lines"
              src="/static/images/welcome-orbit.svg"
              mode="aspectFit"
            />
            <view class="scene-float-avatar scene-float-avatar-top">
              <text class="scene-float-avatar-text">王</text>
            </view>
            <view class="scene-float-avatar scene-float-avatar-bottom">
              <text class="scene-float-avatar-text">李</text>
            </view>

            <view class="scene-project-card">
              <view class="scene-project-heading">
                <view class="scene-project-title-block">
                  <text class="scene-project-title">杭州万象城店装修工程</text>
                  <text class="scene-project-code">GC-2026-001</text>
                </view>
                <view class="scene-project-menu">
                  <image
                    src="/static/icons/caret-down.svg"
                    mode="aspectFit"
                    class="scene-project-menu-icon"
                  />
                </view>
              </view>
              <view class="scene-project-metrics">
                <view class="scene-project-metric">
                  <text class="scene-project-label">{{ t('auth.contractAmount') }}</text>
                  <text class="scene-project-amount">¥ 128,000</text>
                </view>
                <view class="scene-project-divider" />
                <view class="scene-project-metric scene-project-metric-date">
                  <text class="scene-project-label">{{ t('auth.startDate') }}</text>
                  <text class="scene-project-date">2026-09-01</text>
                </view>
              </view>
              <view class="scene-project-footer">
                <view class="scene-surname">
                  <text class="scene-surname-text">李</text>
                </view>
                <view class="scene-project-person">
                  <text class="scene-project-label">{{ t('auth.projectManager') }}</text>
                  <text class="scene-project-name">李志强</text>
                </view>
                <view class="scene-project-contact">
                  <text class="scene-project-label">{{ t('auth.contact') }}</text>
                  <text class="scene-project-name">139-1234-5678</text>
                </view>
              </view>
            </view>

            <view class="scene-approval-card">
              <text class="scene-approval-kicker">{{ t('auth.approvalType') }}</text>
              <text class="scene-approval-title">下单审批</text>
              <view class="scene-approval-meta">
                <view class="scene-approval-person">
                  <view class="scene-surname">
                    <text class="scene-surname-text">张</text>
                  </view>
                  <view class="scene-approval-person-text">
                    <text class="scene-project-label">{{ t('auth.initiator') }}</text>
                    <text class="scene-project-name">张伟</text>
                  </view>
                </view>
                <view class="scene-project-divider" />
                <view class="scene-approval-person-text">
                  <text class="scene-project-label">{{ t('auth.startTime') }}</text>
                  <text class="scene-project-name">2026年4月10日</text>
                </view>
              </view>
              <view class="scene-approval-flow">
                <view class="scene-flow-edge">
                  <text class="scene-flow-edge-text">{{ t('auth.flowStart') }}</text>
                </view>
                <view class="scene-flow-connector">
                  <view class="scene-flow-dot" />
                  <view class="scene-flow-line" />
                  <view class="scene-flow-dot" />
                </view>
                <view class="scene-flow-current">
                  <text class="scene-flow-current-name">王强</text>
                  <text class="scene-flow-current-label">{{ t('auth.flowCurrent') }}</text>
                </view>
                <view class="scene-flow-connector">
                  <view class="scene-flow-dot" />
                  <view class="scene-flow-line" />
                  <view class="scene-flow-dot" />
                </view>
                <view class="scene-flow-edge">
                  <text class="scene-flow-edge-text">{{ t('auth.flowEnd') }}</text>
                </view>
              </view>
            </view>
          </view>
          <view v-else class="slide-image-wrap" :class="[slide.compact ? 'is-compact' : '', slide.frameClass]">
            <image :src="slide.image" mode="widthFix" class="slide-image" />
          </view>
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
      <view class="primary-btn" @click="onOpenRegister">
        <text class="primary-btn-text">{{ t('auth.register') }}</text>
      </view>
      <view class="secondary-btn" @click="openLogin">
        <text class="secondary-btn-text">{{ t('auth.login') }}</text>
      </view>
    </view>

    <SlideOverPanel :show="loginVisible" :z-index="NESTED_PAGE_Z_INDEX" :exit-left="exitLeft">
      <LoginContent
        @back="closeLogin"
        @done="finishAuth"
        @otp="onOpenOtp"
        @forgot="onForgot"
        @signup="onSignUp"
      />
    </SlideOverPanel>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import SlideOverPanel from '@/components/SlideOverPanel.vue';
import LoginContent from '@/components/LoginContent.vue';
import { usePageBack } from '@/composables/usePageBack';
import { useSlideOver } from '@/composables/useSlideOver';
import { NESTED_PAGE_Z_INDEX } from '@/utils/pageFadeTransition';
import { useLanguage } from '@/composables/useLanguage';

const { t } = useLanguage();

defineProps<{
  exitLeft?: boolean;
}>();

const emit = defineEmits<{
  back: [];
  otp: [phone: string];
  forgot: [phone: string];
  register: [phone: string];
  success: [];
}>();

const { visible: loginVisible, open: openLogin, close: closeLogin } = useSlideOver();
const currentSlide = ref(0);

const slides = computed(() => [
  {
    id: 1,
    scene: 'image',
    compact: false,
    frameClass: '',
    image: '/static/images/poster1.png',
    title: t('auth.slide1Title'),
    subtitle: t('auth.slide1Subtitle'),
  },
  {
    id: 2,
    scene: 'image',
    compact: true,
    frameClass: '',
    image: '/static/images/poster2.png',
    title: t('auth.slide2Title'),
    subtitle: t('auth.slide2Subtitle'),
  },
  {
    id: 3,
    scene: 'cards',
    compact: false,
    frameClass: '',
    image: '',
    title: t('auth.slide3Title'),
    subtitle: t('auth.slide3Subtitle'),
  },
  {
    id: 4,
    scene: 'image',
    compact: false,
    frameClass: 'is-poster3',
    image: '/static/images/poster3.png',
    title: t('auth.slide4Title'),
    subtitle: t('auth.slide4Subtitle'),
  },
]);

const activeSlide = computed(() => slides.value[currentSlide.value] ?? slides.value[0]);

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

const onForgot = (phone: string) => {
  emit('forgot', phone);
};

const onSignUp = (phone: string) => {
  emit('register', phone);
};

const onOpenRegister = () => {
  emit('register', '');
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

.welcome-swiper :deep(uni-swiper-item) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-scene {
  position: relative;
  width: 100vw;
  height: 100%;
  flex-shrink: 0;
  overflow: hidden;
}

.welcome-scene-lines {
  position: absolute;
  left: -8%;
  top: 4%;
  width: 116%;
  height: 92%;
  pointer-events: none;
}

.scene-float-avatar {
  position: absolute;
  z-index: 4;
  width: 84rpx;
  height: 84rpx;
  border-radius: 50%;
  background-color: #b2c4d7;
  border: 6rpx solid #ffffff;
  box-shadow: 0 10rpx 28rpx rgba(15, 23, 42, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.scene-float-avatar-top {
  top: 8%;
  right: 7%;
}

.scene-float-avatar-bottom {
  left: 6%;
  bottom: 10%;
}

.scene-float-avatar-text,
.scene-surname-text {
  font-size: 28rpx;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
}

.scene-surname {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background-color: #b2c4d7;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.scene-project-card,
.scene-approval-card {
  position: absolute;
  box-sizing: border-box;
  background-color: #ffffff;
  box-shadow: 0 18rpx 48rpx rgba(15, 23, 42, 0.1);
}

.scene-project-card {
  z-index: 1;
  left: 4%;
  top: 14%;
  width: 78%;
  padding: 28rpx 24rpx 24rpx;
  border-radius: 36rpx;
  transform: rotate(-7deg);
}

.scene-project-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12rpx;
}

.scene-project-title-block {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.scene-project-title {
  font-size: 28rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.35;
}

.scene-project-code {
  font-size: 22rpx;
  color: #9ca3af;
  line-height: 1.2;
}

.scene-project-menu {
  width: 48rpx;
  height: 48rpx;
  border-radius: 16rpx;
  background-color: #f4f6f8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.scene-project-menu-icon {
  width: 28rpx;
  height: 28rpx;
}

.scene-project-metrics {
  margin-top: 20rpx;
  padding: 18rpx 20rpx;
  border-radius: 24rpx;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.scene-project-metric {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.scene-project-metric-date {
  flex: none;
}

.scene-project-label {
  font-size: 20rpx;
  color: #9ca3af;
  line-height: 1.2;
}

.scene-project-amount {
  font-size: 30rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
}

.scene-project-date,
.scene-project-name {
  font-size: 24rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
}

.scene-project-divider {
  width: 2rpx;
  height: 48rpx;
  background-color: #e8edf2;
  flex-shrink: 0;
}

.scene-project-footer {
  margin-top: 18rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.scene-project-person {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.scene-project-contact {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4rpx;
  flex-shrink: 0;
}

.scene-approval-card {
  z-index: 2;
  right: 3%;
  top: 46%;
  width: 88%;
  padding: 28rpx 24rpx 24rpx;
  border-radius: 40rpx;
  border: 2rpx solid rgba(229, 231, 235, 0.9);
  transform: rotate(4deg);
}

.scene-approval-kicker {
  display: block;
  font-size: 20rpx;
  color: #9ca3af;
  line-height: 1.2;
}

.scene-approval-title {
  display: block;
  margin-top: 8rpx;
  font-size: 34rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.25;
}

.scene-approval-meta {
  margin-top: 20rpx;
  padding: 18rpx 16rpx;
  border-radius: 28rpx;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.scene-approval-person {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.scene-approval-person-text {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.scene-approval-flow {
  margin-top: 22rpx;
  padding-top: 20rpx;
  border-top: 2rpx solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.scene-flow-edge {
  height: 52rpx;
  padding: 0 16rpx;
  border-radius: 999rpx;
  background-color: #ffffff;
  border: 2rpx solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.scene-flow-edge-text {
  font-size: 22rpx;
  font-weight: 600;
  color: #6b7280;
  line-height: 1;
}

.scene-flow-connector {
  flex: 1;
  min-width: 12rpx;
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.scene-flow-dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background-color: #d1d5db;
  flex-shrink: 0;
}

.scene-flow-line {
  flex: 1;
  height: 0;
  border-top: 3rpx dashed #d1d5db;
}

.scene-flow-current {
  min-width: 108rpx;
  padding: 12rpx 16rpx;
  border-radius: 24rpx;
  background-color: #111827;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
  flex-shrink: 0;
}

.scene-flow-current-name {
  font-size: 24rpx;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.2;
}

.scene-flow-current-label {
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1;
}

.slide-image-wrap {
  position: relative;
  width: 100%;
}

.slide-image-wrap.is-compact {
  width: 81.944%;
}

.slide-image-wrap.is-poster3 {
  width: 82%;
}

.slide-image-wrap.is-poster3::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 180rpx;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%);
}

.slide-image-wrap.is-compact::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 180rpx;
  height: 100%;
  pointer-events: none;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%);
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
