<template>
  <view class="review-success">
    <view class="success-content">
      <image
        src="/static/images/check-mark.png"
        mode="aspectFit"
        class="success-icon"
      />
      <text class="success-title">{{ t('review.success') }}</text>
      <text class="success-desc">{{ t('review.successDescription') }}</text>
    </view>

    <view class="action-wrap">
      <view class="back-btn" @click="handleBack">
        <text class="back-btn-text">{{ resolvedBackText }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { usePageBack } from '@/composables/usePageBack';
import { computed } from 'vue';
import { useLanguage } from '@/composables/useLanguage';

const { t } = useLanguage();

const props = withDefaults(
  defineProps<{
    backText?: string;
  }>(),
  {
    backText: '',
  },
);

const resolvedBackText = computed(() => props.backText || t('refund.backToOrders'));

const emit = defineEmits<{
  back: [];
}>();

const handleBack = usePageBack(() => emit('back'));
</script>

<style scoped>
.review-success {
  min-height: 100%;
  height: 100%;
  padding: 0 48rpx 80rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.success-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.success-icon {
  width: 400rpx;
  height: 400rpx;
  margin-bottom: 64rpx;
  display: block;
}

.success-title {
  font-size: 48rpx;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 24rpx;
}

.success-desc {
  font-size: 30rpx;
  color: #6b7280;
  line-height: 1.5;
}

.action-wrap {
  flex-shrink: 0;
}

.back-btn {
  height: 104rpx;
  border-radius: 52rpx;
  background-color: #ffffff;
  border: 2rpx solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
}
</style>
