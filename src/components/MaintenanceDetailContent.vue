<template>
  <view class="maintenance-detail-page">
    <view class="detail-header">
      <view class="icon-btn" @click="handleBack">
        <image
          src="/static/icons/chevron-left.svg"
          mode="aspectFit"
          class="header-icon-img"
        />
      </view>
    </view>

    <view class="detail-content">
      <text class="detail-title">{{ t('maintenanceDetail.title') }}</text>

      <view class="info-card info-card-no-line">
        <view class="info-block">
          <text class="info-label">{{ t('maintenanceDetail.project') }}</text>
          <text class="info-value info-value-lg">{{ item.projectName }}</text>
        </view>
        <view class="info-divider" />
        <view class="info-block">
          <text class="info-label">{{ t('maintenanceDetail.team') }}</text>
          <text class="info-value">
            {{ item.managerName }}（{{ item.managerPhone }}）
          </text>
        </view>
        <view class="info-divider" />
        <view class="info-block">
          <text class="info-label">{{ t('maintenanceDetail.number') }}</text>
          <text class="info-value">{{ item.code }}</text>
        </view>
        <view class="info-divider" />
        <view class="info-block">
          <text class="info-label">{{ t('maintenanceDetail.projectNumber') }}</text>
          <text class="info-value">{{ item.projectCode }}</text>
        </view>
        <view class="info-divider" />
        <view class="info-block">
          <text class="info-label">{{ t('maintenanceDetail.address') }}</text>
          <text class="info-value">{{ item.address }}</text>
        </view>
      </view>

      <view class="info-card">
        <view class="meta-row">
          <view class="meta-col">
            <text class="info-label">{{ t('maintenanceDetail.repairType') }}</text>
            <StatusBadge :status="item.repairType" :label="typeLabel" />
          </view>
          <view class="meta-col meta-col-end">
            <text class="info-label">{{ t('maintenanceDetail.status') }}</text>
            <StatusBadge :status="item.status" :label="statusLabel" />
          </view>
        </view>

        <view class="info-block">
          <text class="info-label">{{ t('maintenanceDetail.visitTime') }}</text>
          <text class="info-value visit-time">{{ item.visitTime }}</text>
        </view>

        <view class="info-divider" />

        <view class="info-block">
          <text class="info-label">{{ t('maintenanceDetail.reason') }}</text>
          <text class="info-value info-value-body">{{ item.reason }}</text>
        </view>
      </view>

      <FileAttachmentCard
        :files="item.media"
        :title="t('common.attachments')"
        :empty-text="t('common.noAttachments')"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import StatusBadge from '@/components/StatusBadge.vue';
import FileAttachmentCard from '@/components/FileAttachmentCard.vue';
import type {
  MaintenanceItem,
  MaintenanceStatus,
  RepairType,
} from '@/composables/useMaintenanceItems';
import { usePageBack } from '@/composables/usePageBack';
import { useLanguage } from '@/composables/useLanguage';

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

const props = defineProps<{
  item: MaintenanceItem;
}>();

const emit = defineEmits<{
  back: [];
}>();

const statusLabel = computed(() => STATUS_LABEL.value[props.item.status]);
const typeLabel = computed(() => TYPE_LABEL.value[props.item.repairType]);

const handleBack = usePageBack(() => emit('back'));
</script>

<style scoped>
.maintenance-detail-page {
  min-height: 100%;
  padding-bottom: 80rpx;
  box-sizing: border-box;
}

.detail-header {
  padding: 0 48rpx;
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
</style>
