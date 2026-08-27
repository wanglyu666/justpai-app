<template>
  <view class="maintenance-list-page">
    <view class="page-header">
      <view class="icon-btn" @click="handleBack">
        <image
          src="/static/icons/chevron-left.svg"
          mode="aspectFit"
          class="header-icon-img"
        />
      </view>
      <view class="search-bar">
        <image src="/static/icons/search.svg" mode="aspectFit" class="search-icon" />
        <input
          class="search-input"
          type="text"
          v-model="keyword"
          placeholder="搜索维保"
          placeholder-class="search-placeholder"
        />
      </view>
    </view>

    <view class="content">
      <view class="title-row">
        <view class="title-block">
          <text class="page-title">维保报修管理</text>
          <text class="page-desc">查看全部维保报修</text>
        </view>
        <view class="add-btn" @click="onAdd">
          <text class="add-btn-text">新增</text>
        </view>
      </view>

      <view class="item-list">
        <view
          v-for="item in filteredItems"
          :key="item.id"
          class="item-card"
          @click="openDetail(item)"
        >
          <view class="item-top">
            <text class="item-name">{{ item.projectName }}</text>
            <view class="status-badge" :class="`status-${item.status}`">
              <text class="status-badge-text">{{ statusLabel(item.status) }}</text>
            </view>
          </view>

          <view class="item-field">
            <text class="field-label">维保编号</text>
            <text class="field-value">{{ item.code }}</text>
          </view>
          <view class="item-field">
            <text class="field-label">项目地址</text>
            <text class="field-value">{{ item.address }}</text>
          </view>
          <view class="item-field">
            <text class="field-label">项目主管姓名</text>
            <text class="field-value">{{ item.managerName }}</text>
          </view>
          <view class="item-field">
            <text class="field-label">项目主管电话</text>
            <text class="field-value">{{ item.managerPhone }}</text>
          </view>
        </view>

        <view v-if="filteredItems.length === 0" class="empty-tip">
          <text class="empty-tip-text">暂无相关维保</text>
        </view>
      </view>
    </view>

    <BottomSheetPanel
      :show="detailVisible"
      :z-index="2200"
      @closed="resetDetail"
    >
      <view class="detail-page">
        <view class="detail-header">
          <view class="icon-btn" @click="closeDetail">
            <image
              src="/static/icons/chevron-left.svg"
              mode="aspectFit"
              class="header-icon-img"
            />
          </view>
        </view>

        <view class="detail-content" v-if="selectedItem">
          <text class="detail-title">维保详情</text>

          <view class="info-card info-card-no-line">
            <view class="info-block">
              <text class="info-label">项目</text>
              <text class="info-value info-value-lg">{{ selectedItem.projectName }}</text>
            </view>
            <view class="info-divider" />
            <view class="info-block">
              <text class="info-label">项目组信息</text>
              <text class="info-value">
                {{ selectedItem.managerName }}（{{ selectedItem.managerPhone }}）
              </text>
            </view>
            <view class="info-divider" />
            <view class="info-block">
              <text class="info-label">维保编号</text>
              <text class="info-value">{{ selectedItem.code }}</text>
            </view>
            <view class="info-divider" />
            <view class="info-block">
              <text class="info-label">项目编号</text>
              <text class="info-value">{{ selectedItem.projectCode }}</text>
            </view>
            <view class="info-divider" />
            <view class="info-block">
              <text class="info-label">项目地址</text>
              <text class="info-value">{{ selectedItem.address }}</text>
            </view>
          </view>

          <view class="info-card">
            <view class="meta-row">
              <view class="meta-col">
                <text class="info-label">报修类型</text>
                <view class="type-badge" :class="`type-${selectedItem.repairType}`">
                  <text class="type-badge-text">{{ typeLabel(selectedItem.repairType) }}</text>
                </view>
              </view>
              <view class="meta-col meta-col-end">
                <text class="info-label">工单状态</text>
                <view class="status-badge" :class="`status-${selectedItem.status}`">
                  <text class="status-badge-text">{{ statusLabel(selectedItem.status) }}</text>
                </view>
              </view>
            </view>

            <view class="info-block">
              <text class="info-label">上门时间</text>
              <text class="info-value visit-time">{{ selectedItem.visitTime }}</text>
            </view>

            <view class="info-divider" />

            <view class="info-block">
              <text class="info-label">报修原因</text>
              <text class="info-value info-value-body">{{ selectedItem.reason }}</text>
            </view>
          </view>

          <FileAttachmentCard :files="selectedItem.media" />
        </view>
      </view>
    </BottomSheetPanel>
    <BottomSheetPanel
      :show="formVisible"
      :z-index="2300"
      content-safe-top
      @closed="resetFormFlow"
    >
      <SuccessPageTransition :show-success="formStep === 'success'">
        <MaintenanceFormContent
          ref="formRef"
          @back="closeForm"
          @submit="handleFormSubmit"
        />
        <template #success>
          <MaintenanceSuccessContent @back="closeForm" />
        </template>
      </SuccessPageTransition>
    </BottomSheetPanel>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import BottomSheetPanel from '@/components/BottomSheetPanel.vue';
import FileAttachmentCard from '@/components/FileAttachmentCard.vue';
import SuccessPageTransition from '@/components/SuccessPageTransition.vue';
import MaintenanceFormContent, {
  type MaintenanceFormPayload,
} from '@/components/MaintenanceFormContent.vue';
import MaintenanceSuccessContent from '@/components/MaintenanceSuccessContent.vue';
import {
  useMaintenanceItems,
  type MaintenanceItem,
  type MaintenanceStatus,
  type RepairType,
} from '@/composables/useMaintenanceItems';
import { useSlideOver } from '@/composables/useSlideOver';
import { usePageBack, usePageBackWhen } from '@/composables/usePageBack';

const STATUS_LABEL: Record<MaintenanceStatus, string> = {
  in_maintenance: '维保中',
  pending: '待处理',
  completed: '已完成',
};

const TYPE_LABEL: Record<RepairType, string> = {
  normal: '普通',
  urgent: '紧急',
};

const emit = defineEmits<{
  back: [];
}>();

const keyword = ref('');
const selectedItem = ref<MaintenanceItem | null>(null);
const formRef = ref<InstanceType<typeof MaintenanceFormContent> | null>(null);
const formStep = ref<'form' | 'success'>('form');
const { items, addMaintenance } = useMaintenanceItems();
const {
  visible: detailVisible,
  open: openDetailPanel,
  close: closeDetail,
} = useSlideOver();
const {
  visible: formVisible,
  open: openFormPanel,
  close: closeFormPanel,
} = useSlideOver();
usePageBackWhen(detailVisible, closeDetail);

const filteredItems = computed(() => {
  const q = keyword.value.trim().toLowerCase();
  if (!q) return items.value;
  return items.value.filter((item) => {
    const statusText = STATUS_LABEL[item.status];
    const typeText = TYPE_LABEL[item.repairType];
    return (
      item.code.toLowerCase().includes(q) ||
      item.projectName.toLowerCase().includes(q) ||
      item.address.toLowerCase().includes(q) ||
      item.managerName.toLowerCase().includes(q) ||
      item.managerPhone.includes(q) ||
      statusText.includes(q) ||
      typeText.includes(q)
    );
  });
});

const statusLabel = (status: MaintenanceStatus) => STATUS_LABEL[status];
const typeLabel = (type: RepairType) => TYPE_LABEL[type];

const openDetail = (item: MaintenanceItem) => {
  selectedItem.value = { ...item, media: [...item.media] };
  openDetailPanel();
};

const resetDetail = () => {
  selectedItem.value = null;
};

const handleBack = usePageBack(() => emit('back'));

const onAdd = () => {
  formStep.value = 'form';
  openFormPanel();
};

const closeForm = () => {
  closeFormPanel();
};

const resetFormFlow = () => {
  formStep.value = 'form';
  formRef.value?.resetForm();
};

const handleFormSubmit = (payload: MaintenanceFormPayload) => {
  addMaintenance({
    projectName: payload.projectName,
    address: payload.address,
    managerName: payload.managerName,
    managerPhone: payload.managerPhone,
    projectCode: payload.projectCode,
    repairType: payload.repairType,
    visitTime: payload.visitTime,
    reason: payload.reason,
    attachments: payload.attachments,
  });
  formStep.value = 'success';
};
</script>

<style scoped>
.maintenance-list-page {
  min-height: 100%;
  padding-bottom: 80rpx;
  box-sizing: border-box;
}

.page-header {
  padding: 0 48rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
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

.header-icon-img {
  width: 40rpx;
  height: 40rpx;
}

.search-bar {
  width: 336rpx;
  flex-shrink: 0;
  margin-left: auto;
  height: 88rpx;
  border-radius: 1998rpx;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  padding: 0 28rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
}

.search-icon {
  width: 36rpx;
  height: 36rpx;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #111827;
  height: 100%;
}

.search-placeholder {
  color: #9ca3af;
  font-size: 28rpx;
}

.content {
  padding: 64rpx 48rpx 0;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  margin-bottom: 48rpx;
}

.title-block {
  flex: 1;
  min-width: 0;
}

.page-title {
  display: block;
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

.add-btn {
  flex-shrink: 0;
  height: 88rpx;
  padding: 0 48rpx;
  border-radius: 28rpx;
  background-color: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-btn-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.item-card {
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 40rpx;
  padding: 40rpx 36rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.item-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24rpx;
}

.item-name {
  flex: 1;
  min-width: 0;
  font-size: 36rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.35;
}

.item-field {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.field-label {
  font-size: 24rpx;
  color: #9ca3af;
  line-height: 1.2;
}

.field-value {
  font-size: 30rpx;
  font-weight: 500;
  color: #111827;
  line-height: 1.45;
}

.status-badge {
  height: 52rpx;
  padding: 0 24rpx;
  border-radius: 1998rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 4rpx;
}

.status-badge-text {
  font-size: 24rpx;
  font-weight: 700;
  line-height: 1;
}

.status-in_maintenance {
  background-color: #ffedd5;
}

.status-in_maintenance .status-badge-text {
  color: #ea580c;
}

.status-pending {
  background-color: #dbeafe;
}

.status-pending .status-badge-text {
  color: #2563eb;
}

.status-completed {
  background-color: #dcfce7;
}

.status-completed .status-badge-text {
  color: #15803d;
}

.empty-tip {
  padding: 96rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-tip-text {
  font-size: 28rpx;
  color: #9ca3af;
}

.detail-page {
  min-height: 100%;
  padding-bottom: 80rpx;
  box-sizing: border-box;
}

.detail-header {
  padding: 0 48rpx;
}

.detail-content {
  padding: 48rpx 48rpx 0;
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.detail-title {
  display: block;
  font-size: 56rpx;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 12rpx;
}

.info-card {
  background-color: #ffffff;
  border-radius: 40rpx;
  padding: 40rpx 36rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.04);
}

.info-block {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.info-divider {
  height: 2rpx;
  background-color: #eef2f7;
  margin: 12rpx 0;
}

.info-card-no-line .info-divider {
  background-color: transparent;
  margin: 4rpx 0;
}

.info-label {
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.2;
}

.info-value {
  font-size: 30rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.45;
  word-break: break-all;
}

.info-value-lg {
  font-size: 36rpx;
  font-weight: 800;
  line-height: 1.35;
}

.info-value-body {
  font-size: 30rpx;
  font-weight: 600;
  line-height: 1.55;
}

.meta-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24rpx;
}

.meta-col {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.meta-col-end {
  align-items: flex-end;
}

.visit-time {
  white-space: nowrap;
}

.type-badge {
  height: 52rpx;
  padding: 0 24rpx;
  border-radius: 1998rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
}

.type-badge-text {
  font-size: 24rpx;
  font-weight: 700;
  line-height: 1;
}

.type-normal {
  background-color: #dbeafe;
}

.type-normal .type-badge-text {
  color: #2563eb;
}

.type-urgent {
  background-color: #fee2e2;
}

.type-urgent .type-badge-text {
  color: #dc2626;
}
</style>
