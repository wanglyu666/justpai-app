<template>
  <view class="refund-detail">
    <view class="page-header">
      <view class="header-top-row">
        <view class="icon-btn" @click="handleBack">
          <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="header-icon" />
        </view>
        <text class="header-title">退款详情</text>
        <view class="header-placeholder" />
      </view>
    </view>

    <scroll-view scroll-y class="detail-scroll" :show-scrollbar="false">
      <view class="step-card">
        <view class="refund-progress-track">
          <template v-for="(step, index) in progressSteps" :key="step.id">
            <view class="refund-progress-item">
              <view class="refund-node" :class="`refund-node--${step.status}`">
                <image
                  v-if="step.status === 'completed'"
                  src="/static/icons/check.svg"
                  mode="aspectFit"
                  class="refund-node-check"
                />
                <text v-else class="refund-node-num">{{ index + 1 }}</text>
              </view>
              <text class="refund-label" :class="`refund-label--${step.status}`">
                {{ step.label }}
              </text>
              <text
                v-if="step.subText"
                class="refund-sub"
                :class="`refund-sub--${step.subTone ?? 'muted'}`"
              >
                {{ step.subText }}
              </text>
            </view>
            <view
              v-if="index < progressSteps.length - 1"
              class="refund-line"
              :class="{ active: index < refund.currentStep }"
            />
          </template>
        </view>
      </view>

      <view class="section-card">
        <view class="meta-list">
          <view class="meta-row">
            <text class="meta-label">订单编号</text>
            <text class="meta-value">{{ order.orderNo }}</text>
          </view>
          <view class="meta-row">
            <text class="meta-label">合同编号</text>
            <text class="meta-value">{{ order.contractNo }}</text>
          </view>
          <view class="meta-row">
            <text class="meta-label">退款状态</text>
            <text class="meta-value">{{ refundStatusLabel }}</text>
          </view>
          <view class="meta-row">
            <text class="meta-label">退款原因</text>
            <text class="meta-value">{{ refund.reason }}</text>
          </view>
          <view class="meta-row">
            <text class="meta-label">申请时间</text>
            <text class="meta-value">{{ refund.submittedAt }}</text>
          </view>
          <view class="meta-row">
            <text class="meta-label">联系人</text>
            <text class="meta-value">{{ contactName }}</text>
          </view>
          <view class="meta-row">
            <text class="meta-label">联系电话</text>
            <text class="meta-value">{{ contactPhone }}</text>
          </view>
          <view class="meta-row meta-row-top">
            <text class="meta-label">服务地址</text>
            <text class="meta-value meta-value-wrap">{{ order.serviceAddress }}</text>
          </view>
          <view class="meta-row meta-row-top">
            <text class="meta-label">备注</text>
            <text class="meta-value meta-value-wrap">{{ refundRemark }}</text>
          </view>
          <view class="meta-row meta-row-amount">
            <text class="meta-label">退款金额</text>
            <text class="meta-value meta-value-strong">¥{{ order.amount }}</text>
          </view>
        </view>
      </view>

      <view class="section-card">
        <view class="section-head">
          <text class="section-title">退款商品</text>
          <text class="section-hint">共 {{ refundItems.length }} 件商品</text>
        </view>

        <view class="product-list">
          <view v-for="item in refundItems" :key="item.id" class="detail-item-card">
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
import type { OrderRefundRecord } from '@/composables/useOrderRefunds';
import { getRefundItemsForOrder } from '@/data/refundForm';

type StepStatus = 'completed' | 'current' | 'pending';

const props = defineProps<{
  order: OrderRecord;
  refund: OrderRefundRecord;
}>();

const emit = defineEmits<{
  back: [];
}>();

const stepDefs = [
  { id: 'submit', label: '提交申请' },
  { id: 'review', label: '平台审核', currentSub: '处理中' },
  { id: 'process', label: '退款处理' },
  { id: 'done', label: '退款完成' },
];

const progressSteps = computed(() =>
  stepDefs.map((step, index) => {
    let status: StepStatus = 'pending';
    if (index < props.refund.currentStep) status = 'completed';
    else if (index === props.refund.currentStep) status = 'current';

    let subText = '';
    let subTone: 'muted' | 'active' | undefined;

    if (status === 'completed' && step.id === 'submit') {
      subText = '已提交';
      subTone = 'muted';
    } else if (status === 'current' && step.currentSub) {
      subText = step.currentSub;
      subTone = 'active';
    }

    return {
      ...step,
      status,
      subText,
      subTone,
    };
  }),
);

const refundStatusLabel = computed(() => {
  const labels = ['提交申请', '平台审核中', '退款处理中', '退款完成'];
  return labels[props.refund.currentStep] ?? '平台审核中';
});

const contactName = computed(() => props.order.contactName ?? '管理员');
const contactPhone = computed(() => props.order.contactPhone ?? '138-0013-8000');
const refundRemark = computed(() => props.refund.remarks.trim() || '无');

const refundItems = computed(() => {
  const allItems = getRefundItemsForOrder(props.order.id);
  if (!props.refund.itemIds.length) return allItems;
  return allItems.filter((item) => props.refund.itemIds.includes(item.id));
});

const handleBack = () => {
  emit('back');
};
</script>

<style scoped>
.refund-detail {
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

.refund-progress-track {
  display: flex;
  align-items: flex-start;
}

.refund-progress-item {
  width: 128rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  flex-shrink: 0;
}

.refund-node {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.refund-node--completed {
  background-color: #9fe870;
}

.refund-node--current {
  background-color: #ffffff;
  border: 4rpx solid #9fe870;
}

.refund-node--pending {
  background-color: #f3f4f6;
  border: none;
}

.refund-node-check {
  width: 36rpx;
  height: 36rpx;
  filter: brightness(0) saturate(100%) invert(8%) sepia(41%) saturate(1097%) hue-rotate(62deg) brightness(98%) contrast(103%);
}

.refund-node-num {
  font-size: 30rpx;
  font-weight: 700;
  color: #374151;
  line-height: 1;
}

.refund-node--pending .refund-node-num {
  color: #9ca3af;
}

.refund-label {
  font-size: 28rpx;
  font-weight: 700;
  color: #9ca3af;
  line-height: 1.2;
  text-align: center;
  white-space: nowrap;
}

.refund-label--completed,
.refund-label--current {
  color: #163300;
}

.refund-sub {
  font-size: 24rpx;
  line-height: 1.35;
  text-align: center;
}

.refund-sub--muted {
  color: #9ca3af;
}

.refund-sub--active {
  color: #163300;
  font-weight: 700;
}

.refund-line {
  flex: 1;
  height: 4rpx;
  background-color: #e5e7eb;
  margin-top: 38rpx;
  min-width: 0;
}

.refund-line.active {
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
