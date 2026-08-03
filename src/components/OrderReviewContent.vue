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

const handleBack = () => {
  emit('back');
};

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
  padding: 0 24px 16px;
  flex-shrink: 0;
}

.header-top-row {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
}

.icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.header-icon {
  width: 20px;
  height: 20px;
}

.header-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 18px;
  font-weight: 800;
  color: #111827;
  line-height: 44px;
  pointer-events: none;
}

.header-placeholder {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
}

.form-scroll {
  flex: 1;
  min-height: 0;
  padding: 0 24px;
  box-sizing: border-box;
}

.product-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.04);
  box-sizing: border-box;
}

.product-thumb {
  width: 64px;
  height: 64px;
  border-radius: 14px;
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
  gap: 4px;
}

.product-name {
  font-size: 16px;
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
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.3;
}

.review-card {
  margin-top: 16px;
  padding: 28px 18px 18px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.04);
  box-sizing: border-box;
}

.rating-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rating-title {
  font-size: 16px;
  font-weight: 600;
  color: #6b7280;
  line-height: 1.4;
  text-align: center;
}

.star-row {
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.star-btn {
  width: 44px;
  height: 44px;
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
  width: 44px;
  height: 44px;
  display: block;
  transition: filter 0.2s ease;
}

.star-icon.active {
  filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.45));
}

.rating-label {
  margin-top: 16px;
  min-height: 18px;
  font-size: 15px;
  font-weight: 700;
  color: #f59e0b;
  line-height: 18px;
  text-align: center;
}

.content-section {
  margin-top: 24px;
}

.content-title {
  display: block;
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
  margin-bottom: 12px;
}

.content-textarea {
  width: 100%;
  min-height: 140px;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
  background-color: #f9fafb;
  font-size: 14px;
  color: #111827;
  line-height: 1.5;
  box-sizing: border-box;
}

.content-readonly {
  min-height: 140px;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
  background-color: #f9fafb;
  box-sizing: border-box;
}

.content-readonly-text {
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
  word-break: break-all;
}

.submitted-at-row {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.submitted-at-label {
  font-size: 14px;
  color: #9ca3af;
  flex-shrink: 0;
}

.submitted-at-value {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  text-align: right;
}

.input-placeholder {
  color: #9ca3af;
}

.scroll-bottom-spacer {
  height: 24px;
}

.submit-footer {
  flex-shrink: 0;
  padding: 16px 24px calc(16px + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
}

.submit-btn {
  width: 100%;
  height: 52px;
  border-radius: 999px;
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
  font-size: 16px;
  font-weight: 700;
  color: rgba(22, 51, 0, 0.45);
  transition: color 0.2s ease;
}

.submit-btn.active .submit-text {
  color: #163300;
}
</style>
