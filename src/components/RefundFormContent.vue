<template>
  <view class="refund-form">
    <view class="page-header">
      <view class="icon-btn" @click="handleBack">
        <image src="/static/icons/chevron-left.svg" mode="aspectFit" class="header-icon" />
      </view>
      <text class="page-title">选择退款商品</text>
      <text class="page-desc">点击商品卡片选择需要退款的商品，可多选</text>
    </view>

    <view class="form-scroll-wrap">
      <scroll-view scroll-y class="form-scroll" :show-scrollbar="false">
        <view
          v-for="item in lineItems"
          :key="item.id"
          class="refund-item-card"
          :class="{ selected: selectedIds.includes(item.id) }"
          @click="toggleItem(item.id)"
        >
          <view class="select-circle" :class="{ checked: selectedIds.includes(item.id) }">
            <image
              v-if="selectedIds.includes(item.id)"
              src="/static/icons/check.svg"
              mode="aspectFit"
              class="select-check-icon"
            />
          </view>

          <view class="item-body">
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

        <view class="section-card">
          <text class="field-label">退款原因</text>
          <view class="dropdown-wrap">
            <view
              class="picker-field"
              :class="{ open: reasonOpen }"
              @click.stop="toggleReasonDropdown"
            >
              <text class="picker-text" :class="{ placeholder: reasonIndex < 0 }">
                {{ reasonIndex >= 0 ? refundReasons[reasonIndex] : '请选择退款原因' }}
              </text>
              <text class="picker-arrow" :class="{ open: reasonOpen }">▾</text>
            </view>

            <view v-if="reasonOpen" class="dropdown-menu" @click.stop>
              <view
                v-for="(reason, index) in refundReasons"
                :key="reason"
                class="dropdown-option"
                :class="{ active: reasonIndex === index }"
                @click="selectReason(index)"
              >
                <text class="dropdown-option-text">{{ reason }}</text>
                <image
                  v-if="reasonIndex === index"
                  src="/static/icons/check.svg"
                  mode="aspectFit"
                  class="dropdown-check-icon"
                />
              </view>
            </view>
          </view>
        </view>

        <view class="section-card">
          <text class="field-label">备注</text>
          <textarea
            v-model="remarks"
            class="field-textarea"
            placeholder="请补充退款说明（选填）"
            placeholder-class="input-placeholder"
            :maxlength="500"
          />
        </view>

        <view class="section-card">
          <text class="field-label">附件上传</text>
          <view class="upload-row">
            <view class="upload-btn" @click="handleChooseFile">
              <text class="upload-btn-text">选取文件</text>
            </view>
            <text class="upload-hint">最多 5 个文件，支持图片与文档</text>
          </view>

          <view v-if="attachments.length" class="attachment-list">
            <view v-for="(file, index) in attachments" :key="file" class="attachment-item">
              <text class="attachment-name">附件 {{ index + 1 }}</text>
              <view class="attachment-remove" @click="removeAttachment(index)">
                <text class="attachment-remove-text">移除</text>
              </view>
            </view>
          </view>
        </view>

        <view class="scroll-bottom-spacer" />
      </scroll-view>
    </view>

    <view class="submit-footer">
      <view class="submit-btn" :class="{ active: isSubmitEnabled }" @click="handleSubmit">
        <text class="submit-text">提交</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { OrderRecord } from '@/data/orders';
import {
  getRefundItemsForOrder,
  refundReasons,
  type RefundLineItem,
} from '@/data/refundForm';

const props = defineProps<{
  order: OrderRecord | null;
}>();

const emit = defineEmits<{
  back: [];
  submit: [payload: {
    orderId: string;
    itemIds: string[];
    reason: string;
    remarks: string;
    attachments: string[];
  }];
}>();

const lineItems = ref<RefundLineItem[]>([]);
const selectedIds = ref<string[]>([]);
const reasonIndex = ref(-1);
const reasonOpen = ref(false);
const remarks = ref('');
const attachments = ref<string[]>([]);

const resetForm = () => {
  lineItems.value = props.order ? getRefundItemsForOrder(props.order.id) : [];
  selectedIds.value = [];
  reasonIndex.value = -1;
  remarks.value = '';
  attachments.value = [];
};

watch(
  () => props.order?.id,
  () => resetForm(),
  { immediate: true },
);

const isSubmitEnabled = computed(
  () => selectedIds.value.length > 0 && reasonIndex.value >= 0,
);

const handleBack = () => {
  emit('back');
};

const toggleItem = (id: string) => {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter((itemId) => itemId !== id);
    return;
  }
  selectedIds.value = [...selectedIds.value, id];
};

const toggleReasonDropdown = () => {
  reasonOpen.value = !reasonOpen.value;
};

const selectReason = (index: number) => {
  reasonIndex.value = index;
  reasonOpen.value = false;
};

const handleChooseFile = () => {
  if (attachments.value.length >= 5) {
    uni.showToast({
      title: '最多上传 5 个文件',
      icon: 'none',
    });
    return;
  }

  uni.chooseImage({
    count: 5 - attachments.value.length,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      attachments.value = [...attachments.value, ...res.tempFilePaths].slice(0, 5);
    },
  });
};

const removeAttachment = (index: number) => {
  attachments.value = attachments.value.filter((_, itemIndex) => itemIndex !== index);
};

const handleSubmit = () => {
  if (!isSubmitEnabled.value || !props.order || reasonIndex.value < 0) return;

  emit('submit', {
    orderId: props.order.id,
    itemIds: selectedIds.value,
    reason: refundReasons[reasonIndex.value],
    remarks: remarks.value.trim(),
    attachments: attachments.value,
  });
};
</script>

<style scoped>
.refund-form {
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.page-header {
  padding: 0 48rpx 16rpx;
  flex-shrink: 0;
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
}

.header-icon {
  width: 40rpx;
  height: 40rpx;
}

.page-title {
  display: block;
  margin-top: 32rpx;
  font-size: 56rpx;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.35;
}

.page-desc {
  display: block;
  margin-top: 16rpx;
  font-size: 28rpx;
  color: #6b7280;
  line-height: 1.5;
}

.form-scroll-wrap {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.form-scroll {
  height: 100%;
  padding: 24rpx 48rpx 16rpx;
  box-sizing: border-box;
}

.refund-item-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 24rpx;
  padding: 32rpx;
  background-color: #ffffff;
  border-radius: 40rpx;
  box-shadow: 0 4rpx 24rpx rgba(15, 23, 42, 0.04);
  margin-bottom: 24rpx;
  border: 3rpx solid transparent;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.refund-item-card.selected {
  border-color: #9fe870;
  background-color: rgba(159, 232, 112, 0.08);
}

.select-circle {
  width: 44rpx;
  height: 44rpx;
  border-radius: 22rpx;
  border: 4rpx solid #d1d5db;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 4rpx;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.select-circle.checked {
  border-color: #9fe870;
  background-color: #9fe870;
}

.select-check-icon {
  width: 24rpx;
  height: 24rpx;
}

.item-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
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
  background-color: #f3f4f6;
  padding: 8rpx 16rpx;
  border-radius: 12rpx;
  line-height: 1;
}

.section-card {
  background-color: #ffffff;
  border-radius: 40rpx;
  padding: 36rpx 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 4rpx 24rpx rgba(15, 23, 42, 0.04);
}

.field-label {
  display: block;
  font-size: 30rpx;
  font-weight: 800;
  color: #111827;
  margin-bottom: 20rpx;
}

.picker-field {
  height: 96rpx;
  padding: 0 28rpx;
  border-radius: 24rpx;
  border: 2rpx solid #e5e7eb;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.picker-text {
  font-size: 28rpx;
  color: #111827;
}

.picker-text.placeholder {
  color: #9ca3af;
}

.picker-arrow {
  font-size: 28rpx;
  color: #9ca3af;
  line-height: 1;
  transition: transform 0.2s ease;
}

.picker-arrow.open {
  transform: rotate(180deg);
}

.dropdown-wrap {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 12rpx);
  left: 0;
  right: 0;
  z-index: 50;
  background-color: #ffffff;
  border-radius: 28rpx;
  border: 2rpx solid #e5e7eb;
  box-shadow: 0 24rpx 64rpx rgba(15, 23, 42, 0.14);
  overflow: hidden;
}

.dropdown-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  padding: 26rpx 28rpx;
  border-bottom: 2rpx solid #f3f4f6;
}

.dropdown-option:last-child {
  border-bottom: none;
}

.dropdown-option.active {
  background-color: rgba(159, 232, 112, 0.12);
}

.dropdown-option-text {
  font-size: 28rpx;
  color: #111827;
  line-height: 1.3;
}

.dropdown-option.active .dropdown-option-text {
  font-weight: 700;
  color: #163300;
}

.dropdown-check-icon {
  width: 32rpx;
  height: 32rpx;
  flex-shrink: 0;
}

.field-textarea {
  width: 100%;
  min-height: 240rpx;
  padding: 24rpx 28rpx;
  border-radius: 24rpx;
  border: 2rpx solid #e5e7eb;
  background-color: #ffffff;
  font-size: 28rpx;
  color: #111827;
  line-height: 1.5;
  box-sizing: border-box;
}

.input-placeholder {
  color: #9ca3af;
}

.upload-row {
  display: flex;
  align-items: center;
  gap: 24rpx;
  flex-wrap: wrap;
}

.upload-btn {
  height: 72rpx;
  padding: 0 32rpx;
  border-radius: 1998rpx;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-btn-text {
  font-size: 26rpx;
  font-weight: 700;
  color: #374151;
  line-height: 1;
}

.upload-hint {
  font-size: 24rpx;
  color: #9ca3af;
  line-height: 1.4;
}

.attachment-list {
  margin-top: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.attachment-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx;
  border-radius: 24rpx;
  background-color: #f8fafc;
}

.attachment-name {
  font-size: 26rpx;
  color: #374151;
}

.attachment-remove-text {
  font-size: 24rpx;
  font-weight: 700;
  color: #ef4444;
}

.scroll-bottom-spacer {
  height: 24rpx;
}

.submit-footer {
  flex-shrink: 0;
  padding: 32rpx 48rpx calc(32rpx + env(safe-area-inset-bottom, 0px));
  display: flex;
  justify-content: flex-end;
  background: linear-gradient(180deg, rgba(244, 245, 247, 0) 0%, #f4f5f7 30%);
  box-sizing: border-box;
}

.submit-btn {
  min-width: 240rpx;
  height: 88rpx;
  padding: 0 56rpx;
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
  font-size: 30rpx;
  font-weight: 700;
  color: rgba(22, 51, 0, 0.45);
  transition: color 0.2s ease;
}

.submit-btn.active .submit-text {
  color: #163300;
}
</style>
