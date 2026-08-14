<template>
  <view class="order-card">
    <view class="card-meta-row">
      <text class="deadline-text">{{ order.signedAt }}</text>
      <view class="status-badge">
        <text class="status-badge-text">已签约</text>
      </view>
    </view>

    <view class="card-body">
      <view class="product-row">
        <view class="product-thumb">
          <image :src="order.productImage" mode="aspectFill" class="product-image" />
        </view>

        <view class="product-info">
          <text class="product-name">{{ order.productName }}</text>
          <text class="product-sub">共 {{ order.itemCount }} 件商品</text>
        </view>
      </view>

      <view class="price-col">
        <text class="price-label">订单金额</text>
        <text class="price-value">¥{{ order.amount }}</text>
      </view>
    </view>

    <view class="card-divider" />

    <view class="card-actions">
      <view class="action-btn action-btn--secondary" @click="emit('refund', order.id)">
        <text class="action-btn-text">{{ refundSubmitted ? '退款详情' : '申请退款' }}</text>
      </view>
      <view class="action-btn action-btn--primary" @click="emit('detail', order.id)">
        <text class="action-btn-text action-btn-text--primary">签约详情</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { OrderRecord } from '@/data/orders';

defineProps<{
  order: OrderRecord;
  refundSubmitted?: boolean;
}>();

const emit = defineEmits<{
  detail: [orderId: string];
  refund: [orderId: string];
}>();
</script>

<style scoped>
.order-card {
  padding: 24rpx 28rpx;
  border-radius: 40rpx;
  background-color: #ffffff;
  box-shadow: 0 4rpx 24rpx rgba(15, 23, 42, 0.04);
  box-sizing: border-box;
}

.card-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.deadline-text {
  font-size: 22rpx;
  color: #9ca3af;
  line-height: 1.2;
}

.status-badge {
  height: 44rpx;
  padding: 0 20rpx;
  border-radius: 1998rpx;
  background-color: #dcfce7;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.status-badge-text {
  font-size: 22rpx;
  font-weight: 700;
  color: #166534;
  line-height: 1;
}

.card-body {
  margin-top: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.product-row {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
}

.product-thumb {
  width: 128rpx;
  height: 128rpx;
  border-radius: 24rpx;
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
  font-size: 30rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-sub {
  font-size: 22rpx;
  color: #9ca3af;
  line-height: 1.45;
}

.price-col {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4rpx;
  align-self: flex-end;
  margin-top: -4rpx;
}

.price-label {
  font-size: 22rpx;
  color: #9ca3af;
  line-height: 1.2;
  white-space: nowrap;
}

.price-value {
  font-size: 34rpx;
  font-weight: 800;
  color: #163300;
  line-height: 1.1;
  white-space: nowrap;
}

.card-divider {
  margin-top: 20rpx;
  height: 2rpx;
  background-color: #f3f4f6;
}

.card-actions {
  margin-top: 20rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16rpx;
}

.action-btn {
  height: 64rpx;
  padding: 0 32rpx;
  border-radius: 1998rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.action-btn--primary {
  background-color: #9fe870;
}

.action-btn--secondary {
  background-color: #ffffff;
  border: 2rpx solid #e5e7eb;
}

.action-btn-text {
  font-size: 26rpx;
  font-weight: 700;
  color: #163300;
  line-height: 1;
  white-space: nowrap;
}

.action-btn-text--primary {
  color: #163300;
}
</style>
