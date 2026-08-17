<template>
  <view class="sheet-page">
    <view class="sheet-page__header">
      <view class="sheet-page__back-btn" @click="handleBack">
        <image
          src="/static/icons/chevron-left.svg"
          mode="aspectFit"
          class="sheet-page__back-icon"
        />
      </view>
    </view>

    <view class="sheet-page__body">
      <text class="sheet-page__title">清单详情</text>

      <view class="info-card">
        <view class="info-row">
          <view class="info-field">
            <text class="info-label">报价人</text>
            <text class="info-value">{{ checklist.quoter || '—' }}</text>
          </view>
          <view class="info-field">
            <text class="info-label">联系方式</text>
            <text class="info-value">{{ checklist.contact || '—' }}</text>
          </view>
        </view>
        <view class="info-row">
          <view class="info-field">
            <text class="info-label">报价时间</text>
            <text class="info-value">{{ checklist.quoteTime }}</text>
          </view>
          <view class="info-field">
            <text class="info-label">备注</text>
            <text class="info-value">{{ checklist.remark || '—' }}</text>
          </view>
        </view>
      </view>

      <view class="info-card">
        <view class="card-head">
          <text class="card-heading">清单明细</text>
          <view class="cart-btn" @click="onAddToCart">
            <text class="cart-btn-text">加入购物车</text>
          </view>
        </view>

        <view
          v-for="item in checklist.items"
          :key="item.id"
          class="product-card"
        >
          <view class="product-top">
            <text class="product-name">{{ item.subjectName }}</text>
            <text class="product-total">¥{{ formatMoney(item.totalPrice) }}</text>
          </view>

          <view class="product-grid">
            <view class="product-field">
              <text class="product-label">专业</text>
              <text class="product-value">{{ item.specialty }}</text>
            </view>
            <view class="product-field">
              <text class="product-label">品牌</text>
              <text class="product-value">{{ item.brand }}</text>
            </view>
            <view class="product-field">
              <text class="product-label">数量</text>
              <text class="product-value">{{ item.quantity }}</text>
            </view>
            <view class="product-field">
              <text class="product-label">综合单价</text>
              <text class="product-value">{{ item.unitPrice }}</text>
            </view>
          </view>
        </view>

        <view class="summary-divider" />

        <view class="summary-block">
          <view class="summary-row">
            <view class="summary-field">
              <text class="info-label">专业</text>
              <text class="info-value">{{ checklist.summary.specialty }}</text>
            </view>
            <view class="summary-field">
              <text class="info-label">价格</text>
              <text class="info-value">{{ formatMoney(checklist.summary.price) }}</text>
            </view>
          </view>
          <view class="summary-row">
            <view class="summary-field">
              <text class="info-label">税率%</text>
              <text class="info-value">{{ checklist.summary.taxRate }}</text>
            </view>
            <view class="summary-field">
              <text class="info-label">税金</text>
              <text class="info-value">{{ formatMoney(checklist.summary.tax) }}</text>
            </view>
          </view>
          <view class="summary-row">
            <view class="summary-field">
              <text class="info-label">合计价格</text>
              <text class="info-value">{{ formatMoney(checklist.summary.totalPrice) }}</text>
            </view>
            <view class="summary-field">
              <text class="info-label">含税价格</text>
              <text class="info-value info-value-accent">
                {{ formatMoney(checklist.summary.priceInclTax) }}
              </text>
            </view>
          </view>
        </view>
      </view>

      <view class="section-card">
        <view class="section-head">
          <view class="section-bar" />
          <text class="section-title">附件</text>
        </view>

        <view v-if="checklist.attachments.length" class="attachment-grid">
          <view
            v-for="(file, index) in checklist.attachments"
            :key="`${file}-${index}`"
            class="attachment-item"
          >
            <view class="attachment-ext" :class="`ext-${fileKind(file)}`">
              <text class="attachment-ext-text">{{ fileExt(file) }}</text>
            </view>
            <text class="attachment-name">{{ file }}</text>
          </view>
        </view>
        <text v-else class="section-empty">暂无附件</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
export type ChecklistItem = {
  id: number;
  specialty: string;
  subjectCode: string;
  subjectName: string;
  brand: string;
  series: string;
  quantity: number;
  materialFee: number;
  installFee: number;
  unitPrice: number;
  totalPrice: number;
};

export type ChecklistSummary = {
  specialty: string;
  price: number;
  taxRate: number;
  tax: number;
  totalPrice: number;
  priceInclTax: number;
};

export type ChecklistDetail = {
  quoter: string;
  contact: string;
  quoteTime: string;
  remark: string;
  items: ChecklistItem[];
  summary: ChecklistSummary;
  attachments: string[];
};

const props = defineProps<{
  checklist: ChecklistDetail;
}>();

const emit = defineEmits<{
  back: [];
  addToCart: [];
}>();

const formatMoney = (value: number) =>
  value.toLocaleString('zh-CN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

const fileExt = (name: string) => {
  const index = name.lastIndexOf('.');
  if (index < 0) return 'FILE';
  return name.slice(index + 1).toUpperCase();
};

const fileKind = (name: string) => {
  const ext = fileExt(name).toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
  if (['mp4', 'mov', 'avi'].includes(ext)) return 'video';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'sheet';
  return 'file';
};

const handleBack = () => {
  emit('back');
};

const onAddToCart = () => {
  emit('addToCart');
  uni.showToast({
    title: '已加入购物车',
    icon: 'success',
  });
};
</script>

<style scoped>
.sheet-page__body {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.info-card {
  background-color: #ffffff;
  border-radius: 40rpx;
  padding: 40rpx 36rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 36rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.04);
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
}

.card-heading {
  font-size: 30rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.3;
}

.cart-btn {
  height: 68rpx;
  padding: 0 28rpx;
  border-radius: 999px;
  background-color: #9fe870;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cart-btn-text {
  font-size: 26rpx;
  font-weight: 800;
  color: #163300;
  line-height: 1;
}

.info-row {
  display: flex;
  gap: 32rpx;
}

.info-field {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.info-label {
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.2;
}

.info-value {
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.4;
  word-break: break-all;
}

.info-value-accent {
  color: #111827;
}

.product-card {
  padding: 28rpx;
  border-radius: 32rpx;
  background-color: #f8fafc;
  border: 2rpx solid #eef2f7;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.product-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24rpx;
}

.product-name {
  flex: 1;
  min-width: 0;
  font-size: 32rpx;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.35;
}

.product-total {
  flex-shrink: 0;
  font-size: 36rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx 20rpx;
}

.product-field {
  width: calc((100% - 20rpx) / 2);
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  box-sizing: border-box;
}

.product-label {
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.2;
}

.product-value {
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.35;
  word-break: break-all;
}

.summary-divider {
  height: 2rpx;
  background-color: #eef2f7;
  margin: 4rpx 0;
}

.summary-block {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.summary-row {
  display: flex;
  gap: 32rpx;
}

.summary-field {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.section-card {
  background-color: #ffffff;
  border-radius: 44rpx;
  padding: 36rpx;
  box-sizing: border-box;
  box-shadow: 0 16rpx 48rpx rgba(15, 23, 42, 0.04);
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.section-head {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.section-bar {
  width: 8rpx;
  height: 28rpx;
  border-radius: 4rpx;
  background-color: #9fe870;
  flex-shrink: 0;
}

.section-title {
  font-size: 28rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
}

.section-empty {
  font-size: 28rpx;
  color: #9ca3af;
  line-height: 1.4;
}

.attachment-grid {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.attachment-item {
  width: 100%;
  min-height: 96rpx;
  padding: 20rpx 24rpx;
  border-radius: 28rpx;
  background-color: #f8fafc;
  border: 2rpx solid #eef2f7;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.attachment-ext {
  width: 80rpx;
  height: 56rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: #e5e7eb;
}

.attachment-ext-text {
  font-size: 20rpx;
  font-weight: 800;
  color: #374151;
  line-height: 1;
}

.ext-pdf {
  background-color: #fee2e2;
}

.ext-pdf .attachment-ext-text {
  color: #b91c1c;
}

.ext-image {
  background-color: #dbeafe;
}

.ext-image .attachment-ext-text {
  color: #1d4ed8;
}

.ext-video {
  background-color: #ede9fe;
}

.ext-video .attachment-ext-text {
  color: #6d28d9;
}

.ext-sheet {
  background-color: #dcfce7;
}

.ext-sheet .attachment-ext-text {
  color: #15803d;
}

.attachment-name {
  flex: 1;
  min-width: 0;
  font-size: 26rpx;
  font-weight: 600;
  color: #111827;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
