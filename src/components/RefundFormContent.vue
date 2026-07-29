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
  padding: 0 24px 8px;
  flex-shrink: 0;
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
}

.header-icon {
  width: 20px;
  height: 20px;
}

.page-title {
  display: block;
  margin-top: 16px;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.35;
}

.page-desc {
  display: block;
  margin-top: 8px;
  font-size: 14px;
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
  padding: 12px 24px 8px;
  box-sizing: border-box;
}

.refund-item-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.04);
  margin-bottom: 12px;
  border: 1.5px solid transparent;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.refund-item-card.selected {
  border-color: #9fe870;
  background-color: rgba(159, 232, 112, 0.08);
}

.select-circle {
  width: 22px;
  height: 22px;
  border-radius: 11px;
  border: 2px solid #d1d5db;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.select-circle.checked {
  border-color: #9fe870;
  background-color: #9fe870;
}

.select-check-icon {
  width: 12px;
  height: 12px;
}

.item-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-main-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.item-title-block {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-name {
  font-size: 15px;
  font-weight: 800;
  color: #111827;
  line-height: 1.35;
}

.item-code {
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.3;
}

.item-price-block {
  display: flex;
  align-items: baseline;
  gap: 2px;
  flex-shrink: 0;
  padding-top: 2px;
}

.item-price {
  font-size: 17px;
  font-weight: 800;
  color: #163300;
  line-height: 1;
}

.item-unit {
  font-size: 11px;
  color: #9ca3af;
}

.item-desc {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.5;
}

.item-tag-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.item-tag {
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  background-color: #f3f4f6;
  padding: 4px 8px;
  border-radius: 6px;
  line-height: 1;
}

.section-card {
  background-color: #ffffff;
  border-radius: 20px;
  padding: 18px 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.04);
}

.field-label {
  display: block;
  font-size: 15px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 10px;
}

.picker-field {
  height: 48px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.picker-text {
  font-size: 14px;
  color: #111827;
}

.picker-text.placeholder {
  color: #9ca3af;
}

.picker-arrow {
  font-size: 14px;
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
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 50;
  background-color: #ffffff;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.14);
  overflow: hidden;
}

.dropdown-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 14px;
  border-bottom: 1px solid #f3f4f6;
}

.dropdown-option:last-child {
  border-bottom: none;
}

.dropdown-option.active {
  background-color: rgba(159, 232, 112, 0.12);
}

.dropdown-option-text {
  font-size: 14px;
  color: #111827;
  line-height: 1.3;
}

.dropdown-option.active .dropdown-option-text {
  font-weight: 700;
  color: #163300;
}

.dropdown-check-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.field-textarea {
  width: 100%;
  min-height: 120px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  font-size: 14px;
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
  gap: 12px;
  flex-wrap: wrap;
}

.upload-btn {
  height: 36px;
  padding: 0 16px;
  border-radius: 999px;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-btn-text {
  font-size: 13px;
  font-weight: 700;
  color: #374151;
  line-height: 1;
}

.upload-hint {
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.4;
}

.attachment-list {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.attachment-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 12px;
  background-color: #f8fafc;
}

.attachment-name {
  font-size: 13px;
  color: #374151;
}

.attachment-remove-text {
  font-size: 12px;
  font-weight: 700;
  color: #ef4444;
}

.scroll-bottom-spacer {
  height: 12px;
}

.submit-footer {
  flex-shrink: 0;
  padding: 16px 24px calc(16px + env(safe-area-inset-bottom, 0px));
  display: flex;
  justify-content: flex-end;
  background: linear-gradient(180deg, rgba(244, 245, 247, 0) 0%, #f4f5f7 30%);
  box-sizing: border-box;
}

.submit-btn {
  min-width: 120px;
  height: 44px;
  padding: 0 28px;
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
  font-size: 15px;
  font-weight: 700;
  color: rgba(22, 51, 0, 0.45);
  transition: color 0.2s ease;
}

.submit-btn.active .submit-text {
  color: #163300;
}
</style>
