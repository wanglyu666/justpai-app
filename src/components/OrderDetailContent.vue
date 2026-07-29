<template>
  <view class="order-detail">
    <view class="page-header">
      <view class="header-top-row">
        <view class="icon-btn" @click="handleBack">
          <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="header-icon" />
        </view>
        <text class="header-title">订单详情</text>
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
        <view class="contract-banner">
          <view class="contract-title-block">
            <image src="/static/icons/file-text.svg" mode="aspectFit" class="contract-icon" />
            <text class="contract-title">销售合同</text>
          </view>
          <view class="contract-status-tag">
            <text class="contract-status-text">待支付</text>
          </view>
        </view>

        <view class="meta-list">
          <view class="meta-row">
            <text class="meta-label">合同编号</text>
            <text class="meta-value">{{ order.contractNo }}</text>
          </view>
          <view class="meta-row">
            <text class="meta-label">订单编号</text>
            <text class="meta-value">{{ order.orderNo }}</text>
          </view>
          <view class="meta-row">
            <text class="meta-label">业务类型</text>
            <text class="meta-value">{{ businessType }}</text>
          </view>
          <view class="meta-row">
            <text class="meta-label">预算金额</text>
            <text class="meta-value meta-value-strong">¥{{ order.amount }}</text>
          </view>
          <view class="meta-row">
            <text class="meta-label">项目负责人</text>
            <text class="meta-value">{{ projectOwner }}</text>
          </view>
        </view>
      </view>

      <view class="section-card">
        <view class="contact-card">
          <view class="contact-left">
            <view class="contact-avatar">
              <text class="contact-avatar-text">{{ contactInitial }}</text>
            </view>
            <view class="contact-info">
              <text class="contact-name">{{ contactName }}</text>
              <text class="contact-phone">{{ contactPhone }}</text>
            </view>
          </view>
          <text class="contact-arrow">›</text>
        </view>
      </view>

      <view class="section-card">
        <view class="section-head">
          <text class="section-title">产品信息</text>
          <text class="section-hint">共 {{ order.itemCount }} 件商品</text>
        </view>

        <view class="product-list">
          <view v-for="product in products" :key="product.id" class="product-row">
            <view class="product-thumb">
              <image :src="product.image" mode="aspectFill" class="product-image" />
            </view>
            <view class="product-info">
              <text class="product-name">{{ product.name }}</text>
              <text class="product-spec">{{ product.spec }} · {{ product.brand }}</text>
            </view>
            <text class="product-qty">×{{ product.qty }}</text>
          </view>
        </view>
      </view>

      <view class="section-card">
        <view class="fee-row">
          <text class="fee-label">合同金额</text>
          <text class="fee-value fee-value-strong">¥{{ order.amount }}</text>
        </view>
        <view class="fee-row">
          <text class="fee-label">已支付</text>
          <text class="fee-value fee-value-muted">¥0.00</text>
        </view>
        <view class="fee-row">
          <text class="fee-label">待支付</text>
          <text class="fee-value fee-value-pending">¥{{ order.amount }}</text>
        </view>
      </view>

      <view class="bottom-spacer" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { OrderRecord } from '@/data/orders';

const props = defineProps<{
  order: OrderRecord;
}>();

const emit = defineEmits<{
  back: [];
}>();

const currentStepIndex = 0;

const steps = [
  { id: 'signed', label: '签约', icon: '/static/icons/file-text.svg' },
  { id: 'pay', label: '支付', icon: '/static/icons/order.svg' },
  { id: 'service', label: '服务', icon: '/static/icons/shopping-bag.svg' },
  { id: 'done', label: '完成', icon: '/static/icons/check.svg' },
];

const businessType = '产品销售';
const projectOwner = '张工';
const contactName = '张工';
const contactPhone = '138-0013-8000';

const contactInitial = computed(() => contactName.slice(0, 1));

type ProductLine = {
  id: string;
  name: string;
  image: string;
  spec: string;
  brand: string;
  qty: number;
};

const products: ProductLine[] = [
  {
    id: 'p1',
    name: props.order.productName,
    image: props.order.productImage,
    spec: '标准款',
    brand: '宜家',
    qty: 1,
  },
  {
    id: 'p2',
    name: '配件套装',
    image: props.order.productImage,
    spec: '通用',
    brand: '宜家',
    qty: Math.max(1, props.order.itemCount - 1),
  },
];

const handleBack = () => {
  emit('back');
};
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

.detail-scroll {
  flex: 1;
  min-height: 0;
  padding: 0 24px;
  box-sizing: border-box;
}

.step-card {
  background-color: #ffffff;
  border-radius: 20px;
  padding: 22px 18px;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.04);
  margin-bottom: 16px;
}

.step-row {
  display: flex;
  align-items: flex-start;
}

.step-item {
  width: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.step-icon {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-icon.active {
  background-color: #9fe870;
}

.step-icon-img {
  width: 18px;
  height: 18px;
  filter: brightness(0.35);
}

.step-icon.active .step-icon-img {
  filter: brightness(0) saturate(100%) invert(8%) sepia(41%) saturate(1097%) hue-rotate(62deg) brightness(98%) contrast(103%);
}

.step-text {
  font-size: 12px;
  color: #9ca3af;
  line-height: 1;
}

.step-text.active {
  color: #163300;
  font-weight: 700;
}

.step-connector {
  flex: 1;
  height: 2px;
  background-color: #e5e7eb;
  margin-top: 19px;
}

.step-connector.active {
  background-color: #9fe870;
}

.section-card {
  background-color: #ffffff;
  border-radius: 20px;
  padding: 18px;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.04);
  margin-bottom: 16px;
}

.contract-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-radius: 16px;
  background-color: #163300;
  margin-bottom: 16px;
}

.contract-title-block {
  display: flex;
  align-items: center;
  gap: 10px;
}

.contract-icon {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1);
}

.contract-title {
  font-size: 16px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
}

.contract-status-tag {
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  background-color: rgba(159, 232, 112, 0.18);
  display: flex;
  align-items: center;
}

.contract-status-text {
  font-size: 11px;
  font-weight: 700;
  color: #9fe870;
  line-height: 1;
}

.meta-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.meta-label {
  font-size: 13px;
  color: #9ca3af;
  flex-shrink: 0;
}

.meta-value {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  text-align: right;
}

.meta-value-strong {
  font-size: 15px;
  font-weight: 800;
  color: #163300;
}

.contact-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
}

.contact-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.contact-avatar {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: rgba(159, 232, 112, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-avatar-text {
  font-size: 18px;
  font-weight: 800;
  color: #163300;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.contact-name {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
}

.contact-phone {
  font-size: 13px;
  color: #9ca3af;
}

.contact-arrow {
  font-size: 26px;
  color: #d1d5db;
  line-height: 1;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.section-title {
  font-size: 15px;
  font-weight: 800;
  color: #111827;
}

.section-hint {
  font-size: 12px;
  color: #9ca3af;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-thumb {
  width: 52px;
  height: 52px;
  border-radius: 12px;
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
  gap: 3px;
}

.product-name {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-spec {
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.3;
}

.product-qty {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  flex-shrink: 0;
}

.fee-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
}

.fee-label {
  font-size: 13px;
  color: #6b7280;
}

.fee-value {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.fee-value-strong {
  font-size: 16px;
  font-weight: 800;
  color: #163300;
}

.fee-value-muted {
  color: #9ca3af;
}

.fee-value-pending {
  font-weight: 800;
  color: #163300;
}

.bottom-spacer {
  height: calc(24px + env(safe-area-inset-bottom, 0px));
}
</style>
