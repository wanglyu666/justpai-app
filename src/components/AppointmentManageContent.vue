<template>
  <view class="appointment-manage">
    <view class="page-header">
      <view
        class="icon-btn"
        hover-class="icon-btn-hover"
        :hover-stay-time="80"
        @click.stop="handleBack"
      >
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
          placeholder="搜索预约"
          placeholder-class="search-placeholder"
        />
      </view>
    </view>

    <view class="content">
      <text class="page-title">预约管理</text>
      <text class="page-desc">查看全部预约信息</text>

      <view class="appointment-list">
        <view
          v-for="item in filteredAppointments"
          :key="item.id"
          class="appointment-card"
          @click="openDetail(item)"
        >
          <view class="card-heading">
            <text class="appointment-name">{{ item.projectName }}</text>
          </view>
          <view class="appointment-meta-row">
            <view class="appointment-meta">
              <text class="meta-label">倒计时</text>
              <text class="meta-value">{{ item.countdown }}</text>
            </view>
            <view class="appointment-meta appointment-meta-time">
              <text class="meta-label">预约时间</text>
              <text class="meta-value">{{ item.scheduledAt }}</text>
            </view>
          </view>
          <view class="card-footer">
            <StatusBadge
              :status="item.status"
              :label="statusLabel(item.status)"
              size="compact"
            />
            <view
              v-if="canConfirmAppointment(item.status)"
              class="confirm-btn"
              @click.stop="onConfirm(item)"
            >
              <text class="confirm-btn-text">确认</text>
            </view>
          </view>
        </view>

        <view v-if="filteredAppointments.length === 0" class="empty-tip">
          <text class="empty-tip-text">暂无相关预约</text>
        </view>
      </view>
    </view>

    <BottomSheetPanel
      :show="detailVisible"
      :z-index="2400"
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

        <view class="detail-content" v-if="selectedAppointment">
          <text class="detail-title">预约详情</text>

          <view class="detail-card">
            <view class="detail-row">
              <view class="detail-field detail-field-full">
                <text class="detail-label">项目名称</text>
                <text class="detail-value">{{ selectedAppointment.projectName }}</text>
              </view>
            </view>

            <view class="detail-row">
              <view class="detail-field">
                <text class="detail-label">预约时间</text>
                <text class="detail-value">{{ selectedAppointment.scheduledAt }}</text>
              </view>
              <view class="detail-field">
                <text class="detail-label">状态</text>
                <text class="detail-value">{{ statusLabel(selectedAppointment.status) }}</text>
              </view>
            </view>

            <view class="detail-row">
              <view class="detail-field detail-field-full">
                <text class="detail-label">倒计时</text>
                <text class="detail-value">{{ selectedAppointment.countdown }}</text>
              </view>
            </view>

            <view class="detail-row">
              <view class="detail-field">
                <text class="detail-label">联系人</text>
                <text class="detail-value">{{ selectedAppointment.contact }}</text>
              </view>
              <view class="detail-field">
                <text class="detail-label">联系电话</text>
                <text class="detail-value">{{ selectedAppointment.phone }}</text>
              </view>
            </view>

            <view class="detail-row">
              <view class="detail-field detail-field-full">
                <text class="detail-label">上门地址</text>
                <text class="detail-value">{{ selectedAppointment.address }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </BottomSheetPanel>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, toRef } from 'vue';
import BottomSheetPanel from '@/components/BottomSheetPanel.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import {
  APPOINTMENT_STATUS_LABEL,
  canConfirmAppointment,
  useAppointments,
  type AppointmentItem,
} from '@/composables/useAppointments';
import { useSlideOver } from '@/composables/useSlideOver';
import { usePageBack, usePageBackWhen } from '@/composables/usePageBack';

const props = defineProps<{
  projectId: number;
}>();

const emit = defineEmits<{
  back: [];
}>();

const keyword = ref('');
const selectedAppointment = ref<AppointmentItem | null>(null);
const { appointments } = useAppointments(toRef(props, 'projectId'));
const {
  visible: detailVisible,
  open: openDetailPanel,
  close: closeDetail,
} = useSlideOver();
usePageBackWhen(detailVisible, closeDetail);

const statusLabel = (status: AppointmentItem['status']) =>
  APPOINTMENT_STATUS_LABEL[status];

const filteredAppointments = computed(() => {
  const q = keyword.value.trim().toLowerCase();
  if (!q) return appointments.value;
  return appointments.value.filter((item) => {
    const label = statusLabel(item.status).toLowerCase();
    return (
      item.projectName.toLowerCase().includes(q) ||
      item.scheduledAt.toLowerCase().includes(q) ||
      item.countdown.toLowerCase().includes(q) ||
      item.contact.toLowerCase().includes(q) ||
      label.includes(q)
    );
  });
});

const handleBack = usePageBack(() => emit('back'));

const openDetail = (item: AppointmentItem) => {
  selectedAppointment.value = item;
  openDetailPanel();
};

const resetDetail = () => {
  selectedAppointment.value = null;
};

const onConfirm = (_item: AppointmentItem) => {};
</script>

<style scoped>
.appointment-manage {
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

.icon-btn-hover {
  opacity: 0.85;
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
  background-color: #ffffff;
  border-radius: 1998rpx;
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
  margin-bottom: 48rpx;
  font-size: 28rpx;
  color: #6b7280;
  line-height: 1.5;
}

.appointment-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.appointment-card {
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 40rpx;
  padding: 36rpx 36rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.card-heading {
  display: flex;
  align-items: flex-start;
}

.appointment-name {
  flex: 1;
  min-width: 0;
  font-size: 36rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.3;
}

.appointment-meta-row {
  display: flex;
  align-items: flex-start;
  gap: 32rpx;
}

.appointment-meta {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.appointment-meta-time {
  flex: 1.2;
  align-items: flex-end;
  text-align: right;
}

.meta-label {
  font-size: 24rpx;
  color: #9ca3af;
  line-height: 1.2;
}

.meta-value {
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.4;
  word-break: break-all;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.confirm-btn {
  height: 64rpx;
  padding: 0 40rpx;
  border-radius: 16rpx;
  background-color: #9fe870;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.confirm-btn-text {
  font-size: 26rpx;
  font-weight: 700;
  color: #163300;
  line-height: 1;
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
  display: flex;
  flex-direction: column;
}

.detail-header {
  padding: 0 48rpx;
}

.detail-content {
  padding: 48rpx 48rpx 0;
  flex: 1;
}

.detail-title {
  display: block;
  font-size: 56rpx;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 40rpx;
}

.detail-card {
  background-color: #ffffff;
  border-radius: 48rpx;
  padding: 56rpx 44rpx;
  min-height: 840rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 44rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.04);
}

.detail-row {
  display: flex;
  gap: 36rpx;
}

.detail-field {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.detail-field-full {
  flex: 1 1 100%;
}

.detail-label {
  font-size: 28rpx;
  color: #9ca3af;
  line-height: 1.2;
}

.detail-value {
  font-size: 36rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.35;
  word-break: break-all;
}
</style>
