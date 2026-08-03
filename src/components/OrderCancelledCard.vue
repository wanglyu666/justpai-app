<template>
  <view class="order-card">
    <view class="card-meta-row">
      <text class="deadline-text">{{ order.cancelledAt }}</text>
      <view class="status-badge">
        <text class="status-badge-text">已取消</text>
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
      <view class="action-btn action-btn--secondary" @click="emit('detail', order.id)">
        <text class="action-btn-text">订单详情</text>
      </view>
      <view class="action-btn action-btn--primary" @click="emit('reorder', order.id)">
        <text class="action-btn-text action-btn-text--primary">再次下单</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { OrderRecord } from '@/data/orders';

defineProps<{
  order: OrderRecord;
}>();

const emit = defineEmits<{
  detail: [orderId: string];
  reorder: [orderId: string];
}>();
</script>

<style scoped>
.order-card {
  padding: 12px 14px;
  border-radius: 20px;
  background-color: #ffffff;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.04);
  box-sizing: border-box;
}

.card-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.deadline-text {
  font-size: 11px;
  color: #9ca3af;
  line-height: 1.2;
}

.status-badge {
  height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  background-color: #fee2e2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.status-badge-text {
  font-size: 11px;
  font-weight: 700;
  color: #dc2626;
  line-height: 1;
}

.card-body {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.product-thumb {
  width: 64px;
  height: 64px;
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
  gap: 4px;
}

.product-name {
  font-size: 15px;
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
  font-size: 11px;
  color: #9ca3af;
  line-height: 1.45;
}

.price-col {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  align-self: flex-end;
  margin-top: -2px;
}

.price-label {
  font-size: 11px;
  color: #9ca3af;
  line-height: 1.2;
  white-space: nowrap;
}

.price-value {
  font-size: 17px;
  font-weight: 800;
  color: #163300;
  line-height: 1.1;
  white-space: nowrap;
}

.card-divider {
  margin-top: 10px;
  height: 1px;
  background-color: #f3f4f6;
}

.card-actions {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.action-btn {
  height: 32px;
  padding: 0 16px;
  border-radius: 999px;
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
  border: 1px solid #e5e7eb;
}

.action-btn-text {
  font-size: 13px;
  font-weight: 700;
  color: #163300;
  line-height: 1;
  white-space: nowrap;
}

.action-btn-text--primary {
  color: #163300;
}
</style>
