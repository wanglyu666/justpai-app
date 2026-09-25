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
          :placeholder="t('maintenance.search')"
          placeholder-class="search-placeholder"
        />
      </view>
    </view>

    <view class="content">
      <view class="title-row">
        <view class="title-block">
          <text class="page-title">{{ t('maintenance.title') }}</text>
          <text class="page-desc">{{ t('maintenance.description') }}</text>
        </view>
        <view class="add-btn" @click="onAdd">
          <text class="add-btn-text">{{ t('common.add') }}</text>
        </view>
      </view>

      <view class="item-list">
        <view
          v-for="item in filteredItems"
          :key="item.id"
          class="item-card"
          :class="`item-card--${item.status}`"
          @click="openDetail(item)"
        >
          <view class="card-head">
            <view class="card-project-icon">
              <image src="/static/icons/building-2.svg" mode="aspectFit" class="project-icon" />
            </view>
            <text class="item-name" :style="infoCardTitleStyle">{{ item.projectName }}</text>
            <StatusBadge :status="item.status" :label="statusLabel(item.status)" />
          </view>

          <view class="card-body">
            <view class="card-code-row">
              <text class="card-code-label" :style="infoCardLabelStyle">{{ t('maintenance.number') }}</text>
              <text class="card-code-value">{{ item.code }}</text>
            </view>

            <view class="card-address">
              <view class="address-icon-wrap">
                <image src="/static/icons/map-pin-gray.svg" mode="aspectFit" class="address-icon" />
              </view>
              <view class="address-content">
                <text class="field-label" :style="infoCardLabelStyle">{{ t('maintenance.address') }}</text>
                <text class="address-value" :style="infoCardValueStyle">{{ item.address }}</text>
              </view>
            </view>
          </view>

          <view class="card-footer">
            <view class="manager-avatar">
              <text class="manager-avatar-text">{{ item.managerName.slice(0, 1) }}</text>
            </view>
            <view class="manager-info">
              <text class="footer-label">{{ t('maintenance.manager') }}</text>
              <text class="manager-name">{{ item.managerName }}</text>
            </view>
            <view class="phone-info">
              <text class="footer-label">{{ t('maintenance.phone') }}</text>
              <text class="phone-value">{{ item.managerPhone }}</text>
            </view>
          </view>
        </view>

        <view v-if="filteredItems.length === 0" class="empty-tip">
          <text class="empty-tip-text">{{ t('maintenance.empty') }}</text>
        </view>
      </view>
    </view>

    <BottomSheetPanel
      :show="detailVisible"
      :z-index="2200"
      @closed="resetDetail"
    >
      <MaintenanceDetailContent
        v-if="selectedItem"
        :item="selectedItem"
        @back="closeDetail"
      />
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
import StatusBadge from '@/components/StatusBadge.vue';
import SuccessPageTransition from '@/components/SuccessPageTransition.vue';
import MaintenanceDetailContent from '@/components/MaintenanceDetailContent.vue';
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
import { useLanguage } from '@/composables/useLanguage';
import {
  infoCardLabelStyle,
  infoCardTitleStyle,
  infoCardValueStyle,
} from '@/config/infoCard';

const { t } = useLanguage();

const STATUS_LABEL = computed<Record<MaintenanceStatus, string>>(() => ({
  in_maintenance: t('maintenanceDetail.inMaintenance'),
  pending: t('maintenanceDetail.pending'),
  completed: t('maintenanceDetail.completed'),
}));

const TYPE_LABEL = computed<Record<RepairType, string>>(() => ({
  normal: t('maintenanceDetail.normal'),
  urgent: t('maintenanceDetail.urgent'),
}));

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
    const statusText = STATUS_LABEL.value[item.status];
    const typeText = TYPE_LABEL.value[item.repairType];
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

const statusLabel = (status: MaintenanceStatus) => STATUS_LABEL.value[status];

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
  overflow: hidden;
  box-shadow: 0 8rpx 28rpx rgba(15, 23, 42, 0.045);
  display: flex;
  flex-direction: column;
}

.item-card:active {
  opacity: 0.88;
}

.card-head {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 32rpx 32rpx 28rpx;
  background-color: #f7f9fb;
}

.item-card--in_maintenance .card-head {
  background-color: #f4faf3;
}

.item-card--pending .card-head {
  background-color: #f4f7fd;
}

.card-project-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 24rpx;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2rpx 10rpx rgba(15, 23, 42, 0.05);
}

.project-icon {
  width: 38rpx;
  height: 38rpx;
}

.item-name {
  flex: 1;
  min-width: 0;
}

.card-body {
  padding: 30rpx 32rpx 24rpx;
}

.card-code-row {
  min-height: 64rpx;
  padding: 0 20rpx;
  border-radius: 20rpx;
  background-color: #f7f8fa;
  display: flex;
  align-items: center;
  gap: 14rpx;
  box-sizing: border-box;
}

.card-code-label {
  flex-shrink: 0;
}

.card-code-value {
  flex: 1;
  min-width: 0;
  font-size: 26rpx;
  font-weight: 700;
  color: #374151;
  line-height: 1.3;
  word-break: break-all;
}

.card-address {
  display: flex;
  align-items: flex-start;
  gap: 18rpx;
  padding: 28rpx 4rpx 4rpx;
}

.address-icon-wrap {
  width: 48rpx;
  height: 48rpx;
  border-radius: 16rpx;
  background-color: #f3f5f6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.address-icon {
  width: 28rpx;
  height: 28rpx;
}

.address-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.address-value {
  word-break: break-all;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin: 0 32rpx;
  padding: 24rpx 0 30rpx;
  border-top: 2rpx solid #f0f2f4;
}

.manager-avatar {
  width: 68rpx;
  height: 68rpx;
  border-radius: 50%;
  background-color: #b2c4d7;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.manager-avatar-text {
  font-size: 28rpx;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
}

.manager-info,
.phone-info {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.manager-info {
  flex: 1;
  min-width: 0;
}

.phone-info {
  align-items: flex-end;
  flex-shrink: 0;
}

.footer-label {
  font-size: 22rpx;
  color: #9ca3af;
  line-height: 1.2;
}

.manager-name,
.phone-value {
  font-size: 28rpx;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.3;
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

</style>
