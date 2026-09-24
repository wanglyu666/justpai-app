<template>
  <view class="order-detail">
    <view class="page-header">
      <view class="header-top-row">
        <view class="icon-btn" @click="handleBack">
          <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="header-icon" />
        </view>
        <text class="header-title">{{ t('order.details') }}</text>
        <view class="header-placeholder" />
      </view>
    </view>

    <scroll-view scroll-y class="detail-scroll" :show-scrollbar="false">
      <view class="step-card">
        <view class="step-row">
          <template v-for="(step, index) in steps" :key="step.id">
            <view class="step-item">
              <view class="step-icon" :class="{ active: currentStepIndex >= index }">
                <image :src="step.icon" mode="aspectFit" class="step-icon-img" />
              </view>
              <text class="step-text" :class="{ active: currentStepIndex >= index }">
                {{ step.label }}
              </text>
            </view>
            <view
              v-if="index < steps.length - 1"
              class="step-connector"
              :class="{ active: currentStepIndex > index }"
            />
          </template>
        </view>
      </view>

      <view class="section-card">
        <view class="meta-list">
          <view class="meta-row">
            <text class="meta-label">{{ t('order.number') }}</text>
            <text class="meta-value">{{ order.orderNo }}</text>
          </view>
          <view class="meta-row">
            <text class="meta-label">{{ t('order.contractNumber') }}</text>
            <text class="meta-value">{{ order.contractNo }}</text>
          </view>
          <view class="meta-row">
            <text class="meta-label">{{ t('order.status') }}</text>
            <text class="meta-value">{{ statusLabel }}</text>
          </view>
          <view class="meta-row">
            <text class="meta-label">{{ t('address.contact') }}</text>
            <text class="meta-value">{{ contactName }}</text>
          </view>
          <view class="meta-row">
            <text class="meta-label">{{ t('address.phone') }}</text>
            <text class="meta-value">{{ contactPhone }}</text>
          </view>
          <view class="meta-row meta-row-top">
            <text class="meta-label">{{ t('order.address') }}</text>
            <text class="meta-value meta-value-wrap">{{ order.serviceAddress }}</text>
          </view>
          <view class="meta-row">
            <text class="meta-label">{{ t('order.createdAt') }}</text>
            <text class="meta-value">{{ order.orderTime }}</text>
          </view>
          <view v-if="order.payDeadline" class="meta-row">
            <text class="meta-label">{{ t('order.paymentDeadline') }}</text>
            <text class="meta-value">{{ order.payDeadline }}</text>
          </view>
          <view class="meta-row meta-row-amount">
            <text class="meta-label">{{ t('order.amount') }}</text>
            <text class="meta-value meta-value-strong">¥{{ order.amount }}</text>
          </view>
        </view>
      </view>

      <view class="section-card">
        <view class="section-head">
          <text class="section-title">{{ t('order.productInfo') }}</text>
          <text class="section-hint">{{ tf('order.productCount', { count: order.itemCount }) }}</text>
        </view>

        <view class="product-list">
          <view v-for="item in lineItems" :key="item.id" class="detail-item-card">
            <view class="item-main-row">
              <view class="item-title-block">
                <text class="item-name">{{ item.subjectName }}</text>
                <text class="item-code">{{ item.subjectCode }}</text>
              </view>
              <view class="item-price-block">
                <text class="item-price">¥{{ item.unitPrice }}</text>
                <text class="item-unit">/{{ item.unit }}</text>
              </view>
            </view>

            <text class="item-desc">{{ item.description }}</text>

            <view class="item-tag-row">
              <text class="item-tag">{{ item.specialty }}</text>
              <text class="item-tag">{{ item.brand }} · {{ item.series }}</text>
              <text class="item-tag">{{ item.spec }}</text>
              <text class="item-tag">{{ item.calcRule }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="bottom-spacer" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { OrderRecord } from '@/data/orders';
import { getRefundItemsForOrder } from '@/data/refundForm';
import { usePageBack } from '@/composables/usePageBack';
import { useLanguage } from '@/composables/useLanguage';

const { t, tf } = useLanguage();

const props = defineProps<{
  order: OrderRecord;
}>();

const emit = defineEmits<{
  back: [];
}>();

const currentStepIndex = 0;

const steps = computed(() => [
  { id: 'signed', label: t('order.stepSign'), icon: '/static/icons/file-text.svg' },
  { id: 'pay', label: t('order.stepPay'), icon: '/static/icons/order.svg' },
  { id: 'service', label: t('order.stepService'), icon: '/static/icons/shopping-bag.svg' },
  { id: 'done', label: t('order.stepDone'), icon: '/static/icons/check.svg' },
]);

const statusLabels = computed<Record<OrderRecord['status'], string>>(() => ({
  pending: t('order.pending'),
  signed: t('order.signed'),
  service: t('order.service'),
  completed: t('order.completed'),
  cancelled: t('order.cancelled'),
  reviewed: t('order.reviewed'),
}));

const statusLabel = computed(() => statusLabels.value[props.order.status]);

const contactName = computed(() => props.order.contactName ?? '管理员');
const contactPhone = computed(() => props.order.contactPhone ?? '138-0013-8000');

const lineItems = computed(() => getRefundItemsForOrder(props.order.id));

const handleBack = usePageBack(() => emit('back'));
</script>

<style scoped>
.order-detail {
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

.detail-scroll {
  flex: 1;
  min-height: 0;
  padding: 0 48rpx;
  box-sizing: border-box;
}

.step-card {
  background-color: #ffffff;
  border-radius: 40rpx;
  padding: 44rpx 36rpx;
  box-shadow: 0 4rpx 24rpx rgba(15, 23, 42, 0.04);
  margin-bottom: 32rpx;
}

.step-row {
  display: flex;
  align-items: flex-start;
}

.step-item {
  width: 128rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.step-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-icon.active {
  background-color: #9fe870;
}

.step-icon-img {
  width: 36rpx;
  height: 36rpx;
  filter: brightness(0.35);
}

.step-icon.active .step-icon-img {
  filter: brightness(0) saturate(100%) invert(8%) sepia(41%) saturate(1097%) hue-rotate(62deg) brightness(98%) contrast(103%);
}

.step-text {
  font-size: 28rpx;
  color: #9ca3af;
  line-height: 1.2;
}

.step-text.active {
  color: #163300;
  font-weight: 700;
}

.step-connector {
  flex: 1;
  height: 4rpx;
  background-color: #e5e7eb;
  margin-top: 38rpx;
}

.step-connector.active {
  background-color: #9fe870;
}

.section-card {
  background-color: #ffffff;
  border-radius: 40rpx;
  padding: 36rpx;
  box-shadow: 0 4rpx 24rpx rgba(15, 23, 42, 0.04);
  margin-bottom: 32rpx;
}

.meta-list {
  display: flex;
  flex-direction: column;
  gap: 36rpx;
}

.meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40rpx;
}

.meta-row-top {
  align-items: flex-start;
}

.meta-row-amount {
  padding-top: 20rpx;
  margin-top: 12rpx;
  border-top: 2rpx solid #f3f4f6;
}

.meta-label {
  width: 192rpx;
  font-size: 28rpx;
  color: #9ca3af;
  flex-shrink: 0;
  line-height: 1.45;
}

.meta-value {
  flex: 1;
  min-width: 0;
  font-size: 28rpx;
  font-weight: 600;
  color: #374151;
  text-align: right;
  line-height: 1.45;
}

.meta-value-wrap {
  margin-left: 24rpx;
  line-height: 1.5;
  word-break: break-all;
}

.meta-value-strong {
  font-size: 44rpx;
  font-weight: 800;
  color: #163300;
  line-height: 1.1;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 800;
  color: #111827;
}

.section-hint {
  font-size: 24rpx;
  color: #9ca3af;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.detail-item-card {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding: 28rpx;
  border-radius: 32rpx;
  background-color: #f8fafc;
  border: 2rpx solid #eef2f7;
  box-sizing: border-box;
}

.item-main-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24rpx;
}

.item-title-block {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.item-name {
  font-size: 30rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.35;
}

.item-code {
  font-size: 24rpx;
  color: #9ca3af;
  line-height: 1.3;
}

.item-price-block {
  display: flex;
  align-items: baseline;
  gap: 4rpx;
  flex-shrink: 0;
  padding-top: 4rpx;
}

.item-price {
  font-size: 34rpx;
  font-weight: 800;
  color: #163300;
  line-height: 1;
}

.item-unit {
  font-size: 22rpx;
  color: #9ca3af;
}

.item-desc {
  font-size: 24rpx;
  color: #6b7280;
  line-height: 1.5;
}

.item-tag-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex-wrap: wrap;
}

.item-tag {
  font-size: 22rpx;
  font-weight: 600;
  color: #6b7280;
  background-color: #ffffff;
  border: 2rpx solid #eef2f7;
  padding: 8rpx 16rpx;
  border-radius: 12rpx;
  line-height: 1;
}

.bottom-spacer {
  height: calc(48rpx + env(safe-area-inset-bottom, 0px));
}
</style>
