<template>
  <view class="review-form">
    <view class="page-header">
      <view class="header-top-row">
        <view class="icon-btn" @click="handleBack">
          <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="header-icon" />
        </view>
        <text class="header-title">{{ editable ? '订单评价' : '查看评价' }}</text>
        <view class="header-placeholder" />
      </view>
    </view>

    <scroll-view scroll-y class="form-scroll" :show-scrollbar="false">
      <view class="product-card">
        <view class="product-thumb">
          <image :src="order.productImage" mode="aspectFill" class="product-image" />
        </view>
        <view class="product-info">
          <text class="product-name">{{ order.productName }}</text>
          <text class="product-order-no">订单编号：{{ order.orderNo }}</text>
        </view>
      </view>

      <view class="review-card">
        <view class="rating-section">
          <text class="rating-title">{{ editable ? '请对本次服务进行评分' : '评价结果' }}</text>

          <view class="star-row">
            <view
              v-for="star in 5"
              :key="star"
              class="star-btn"
              :class="{ 'star-btn--readonly': !editable }"
              @click="setRating(star)"
            >
              <image
                :src="star <= rating ? starFilledIcon : starOutlineIcon"
                mode="aspectFit"
                class="star-icon"
                :class="{ active: star <= rating }"
              />
            </view>
          </view>

          <text class="rating-label">{{ ratingLabel }}</text>
        </view>

        <view class="content-section">
          <text class="content-title">评价内容</text>
          <textarea
            v-if="editable"
            v-model="content"
            class="content-textarea"
            placeholder="请写下您的宝贵评价..."
            placeholder-class="input-placeholder"
            :maxlength="500"
          />
          <view v-else class="content-readonly">
            <text class="content-readonly-text">{{ displayContent }}</text>
          </view>
        </view>

        <view v-if="!editable && submittedAt" class="submitted-at-row">
          <text class="submitted-at-label">评价时间</text>
          <text class="submitted-at-value">{{ submittedAt }}</text>
        </view>
      </view>

      <view class="scroll-bottom-spacer" />
    </scroll-view>

    <view v-if="editable" class="submit-footer">
      <view class="submit-btn" :class="{ active: rating > 0 }" @click="handleSubmit">
        <text class="submit-text">提交评价</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { OrderRecord } from '@/data/orders';
import { usePageBack } from '@/composables/usePageBack';

const starOutlineIcon = '/static/icons/star-outline.svg';
const starFilledIcon = '/static/icons/star-filled.svg';

const props = withDefaults(
  defineProps<{
    order: OrderRecord;
    editable?: boolean;
    existingRating?: number;
    existingContent?: string;
    submittedAt?: string;
  }>(),
  {
    editable: true,
  },
);

const emit = defineEmits<{
  back: [];
  submit: [payload: { orderId: string; rating: number; content: string }];
}>();

const rating = ref(props.existingRating ?? 0);
const content = ref(props.existingContent ?? '');

watch(
  () => [props.existingRating, props.existingContent, props.editable],
  () => {
    rating.value = props.existingRating ?? 0;
    content.value = props.existingContent ?? '';
  },
);

const ratingLabels = ['', '非常不满意', '不满意', '一般', '满意', '非常满意'];

const ratingLabel = computed(() => ratingLabels[rating.value] ?? '');

const displayContent = computed(() => content.value.trim() || '无');

const setRating = (value: number) => {
  if (!props.editable) return;
  rating.value = value;
};

const handleBack = usePageBack(() => emit('back'));

const handleSubmit = () => {
  if (rating.value <= 0) return;

  emit('submit', {
    orderId: props.order.id,
    rating: rating.value,
    content: content.value.trim(),
  });
};
</script>

<style scoped>
.review-form {
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.page-header {
  padding: 0 48rpx 32rpx;
  flex-shrink: 0;
}

.header-top-row {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
}

.icon-btn {
  width: 88rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.header-icon {
  width: 40rpx;
  height: 40rpx;
}

.header-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 36rpx;
  font-weight: 800;
  color: #111827;
  line-height: 88rpx;
  pointer-events: none;
}

.header-placeholder {
  width: 88rpx;
  height: 88rpx;
  flex-shrink: 0;
}

.form-scroll {
  flex: 1;
  min-height: 0;
  padding: 0 48rpx;
  box-sizing: border-box;
}

.product-card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 28rpx;
  background-color: #ffffff;
  border-radius: 40rpx;
  box-shadow: 0 4rpx 24rpx rgba(15, 23, 42, 0.04);
  box-sizing: border-box;
}

.product-thumb {
  width: 128rpx;
  height: 128rpx;
  border-radius: 28rpx;
  overflow: hidden;
  background-color: #f3f4f6;
  flex-shrink: 0;
}

.product-image {
  width: 100%;
  height: 100%;
  display: block;
}

.product-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.product-name {
  font-size: 32rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-order-no {
  font-size: 24rpx;
  color: #9ca3af;
  line-height: 1.3;
}

.review-card {
  margin-top: 32rpx;
  padding: 56rpx 36rpx 36rpx;
  background-color: #ffffff;
  border-radius: 40rpx;
  box-shadow: 0 4rpx 24rpx rgba(15, 23, 42, 0.04);
  box-sizing: border-box;
}

.rating-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rating-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #6b7280;
  line-height: 1.4;
  text-align: center;
}

.star-row {
  margin-top: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24rpx;
}

.star-btn {
  width: 88rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.star-btn:active {
  transform: scale(1.1);
}

.star-btn--readonly:active {
  transform: none;
}

.star-icon {
  width: 88rpx;
  height: 88rpx;
  display: block;
  transition: filter 0.2s ease;
}

.star-icon.active {
  filter: drop-shadow(0 0 16rpx rgba(251, 191, 36, 0.45));
}

.rating-label {
  margin-top: 32rpx;
  min-height: 36rpx;
  font-size: 30rpx;
  font-weight: 700;
  color: #f59e0b;
  line-height: 36rpx;
  text-align: center;
}

.content-section {
  margin-top: 48rpx;
}

.content-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
  margin-bottom: 24rpx;
}

.content-textarea {
  width: 100%;
  min-height: 280rpx;
  padding: 28rpx;
  border-radius: 24rpx;
  border: 2rpx solid #f3f4f6;
  background-color: #f9fafb;
  font-size: 28rpx;
  color: #111827;
  line-height: 1.5;
  box-sizing: border-box;
}

.content-readonly {
  min-height: 280rpx;
  padding: 28rpx;
  border-radius: 24rpx;
  border: 2rpx solid #f3f4f6;
  background-color: #f9fafb;
  box-sizing: border-box;
}

.content-readonly-text {
  font-size: 28rpx;
  color: #374151;
  line-height: 1.5;
  word-break: break-all;
}

.submitted-at-row {
  margin-top: 40rpx;
  padding-top: 32rpx;
  border-top: 2rpx solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
}

.submitted-at-label {
  font-size: 28rpx;
  color: #9ca3af;
  flex-shrink: 0;
}

.submitted-at-value {
  font-size: 28rpx;
  font-weight: 600;
  color: #374151;
  text-align: right;
}

.input-placeholder {
  color: #9ca3af;
}

.scroll-bottom-spacer {
  height: 48rpx;
}

.submit-footer {
  flex-shrink: 0;
  padding: 32rpx 48rpx calc(32rpx + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
}

.submit-btn {
  width: 100%;
  height: 104rpx;
  border-radius: 1998rpx;
  background-color: rgba(159, 232, 112, 0.38);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.submit-btn.active {
  background-color: #9fe870;
}

.submit-text {
  font-size: 32rpx;
  font-weight: 700;
  color: rgba(22, 51, 0, 0.45);
  transition: color 0.2s ease;
}

.submit-btn.active .submit-text {
  color: #163300;
}
</style>
