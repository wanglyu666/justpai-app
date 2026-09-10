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
              class="action-btn"
              @click.stop="onConfirm(item)"
            >
              <text class="action-btn-text">确认</text>
            </view>
            <view
              v-else-if="canViewAcceptance(item)"
              class="action-btn action-btn-muted"
              @click.stop="onViewAcceptance(item)"
            >
              <text class="action-btn-text">查看验收</text>
            </view>
          </view>
        </view>

        <view v-if="filteredAppointments.length === 0" class="empty-tip">
          <text class="empty-tip-text">暂无相关预约</text>
        </view>
      </view>
    </view>

    <SlideOverPanel
      :show="acceptanceVisible"
      :z-index="2500"
      content-safe-top
      @closed="resetAcceptance"
    >
      <SuccessPageTransition :show-success="acceptanceStep === 'success'">
        <AppointmentCustomerAcceptanceContent
          v-if="acceptanceAppointment"
          :files="acceptanceAppointment.attachments ?? []"
          :accepted="acceptanceAccepted"
          @back="closeAcceptance"
          @confirm="handleAcceptanceConfirm"
        />
        <template #success>
          <FeedbackSuccessContent
            desc="验收已确认"
            back-text="返回预约管理"
            @back="closeAcceptance"
          />
        </template>
      </SuccessPageTransition>
    </SlideOverPanel>

    <AppointmentTimeConfirmSheet
      :show="timeConfirmVisible"
      :show-success="timeConfirmStep === 'success'"
      :scheduled-at="timeConfirmAppointment?.scheduledAt ?? ''"
      @close="onTimeConfirmClosed"
      @confirm="handleTimeConfirm"
    />

    <AppointmentChangeConfirmSheet
      :show="changeConfirmVisible"
      :show-success="changeConfirmStep === 'success'"
      :scheduled-at="changeConfirmAppointment?.scheduledAt ?? ''"
      :change-reason="changeConfirmAppointment?.changeReason ?? ''"
      @close="onChangeConfirmClosed"
      @confirm="handleChangeConfirm"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, ref, toRef } from 'vue';
import SlideOverPanel from '@/components/SlideOverPanel.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import AppointmentCustomerAcceptanceContent from '@/components/AppointmentCustomerAcceptanceContent.vue';
import AppointmentTimeConfirmSheet from '@/components/AppointmentTimeConfirmSheet.vue';
import AppointmentChangeConfirmSheet from '@/components/AppointmentChangeConfirmSheet.vue';
import SuccessPageTransition from '@/components/SuccessPageTransition.vue';
import FeedbackSuccessContent from '@/components/FeedbackSuccessContent.vue';
import {
  APPOINTMENT_STATUS_LABEL,
  canConfirmAppointment,
  confirmAppointmentAcceptance,
  confirmAppointmentChange,
  confirmAppointmentTime,
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
const { appointments } = useAppointments(toRef(props, 'projectId'));
const {
  visible: acceptanceVisible,
  open: openAcceptancePanel,
  close: closeAcceptance,
} = useSlideOver();

const acceptanceAppointment = ref<AppointmentItem | null>(null);
const acceptanceStep = ref<'form' | 'success'>('form');
const acceptanceAccepted = ref(false);
usePageBackWhen(acceptanceVisible, closeAcceptance);

const {
  visible: timeConfirmVisible,
  open: openTimeConfirmPanel,
  close: closeTimeConfirmPanel,
} = useSlideOver();
const timeConfirmAppointment = ref<AppointmentItem | null>(null);
const timeConfirmStep = ref<'form' | 'success'>('form');
usePageBackWhen(timeConfirmVisible, closeTimeConfirmPanel);

const {
  visible: changeConfirmVisible,
  open: openChangeConfirmPanel,
  close: closeChangeConfirmPanel,
} = useSlideOver();
const changeConfirmAppointment = ref<AppointmentItem | null>(null);
const changeConfirmStep = ref<'form' | 'success'>('form');
usePageBackWhen(changeConfirmVisible, closeChangeConfirmPanel);

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

const canViewAcceptance = (item: AppointmentItem) =>
  item.status === 'completed' && (item.attachments?.length ?? 0) > 0;

const handleBack = usePageBack(() => emit('back'));

const resetAcceptance = () => {
  acceptanceAppointment.value = null;
  acceptanceStep.value = 'form';
  acceptanceAccepted.value = false;
};

const onConfirm = (item: AppointmentItem) => {
  if (item.status === 'pending_acceptance') {
    acceptanceAppointment.value = item;
    acceptanceStep.value = 'form';
    acceptanceAccepted.value = false;
    openAcceptancePanel();
    return;
  }
  if (item.status === 'pending_confirm_time') {
    timeConfirmAppointment.value = item;
    timeConfirmStep.value = 'form';
    openTimeConfirmPanel();
    return;
  }
  if (item.status === 'pending_confirm_change') {
    changeConfirmAppointment.value = item;
    changeConfirmStep.value = 'form';
    openChangeConfirmPanel();
  }
};

const onViewAcceptance = (item: AppointmentItem) => {
  acceptanceAppointment.value = item;
  acceptanceStep.value = 'form';
  acceptanceAccepted.value = true;
  openAcceptancePanel();
};

const handleChangeConfirm = () => {
  if (!changeConfirmAppointment.value) return;
  confirmAppointmentChange(changeConfirmAppointment.value.id);
  changeConfirmStep.value = 'success';
};

const resetChangeConfirm = () => {
  changeConfirmAppointment.value = null;
  changeConfirmStep.value = 'form';
};

const onChangeConfirmClosed = () => {
  closeChangeConfirmPanel();
  resetChangeConfirm();
};

const handleTimeConfirm = () => {
  if (!timeConfirmAppointment.value) return;
  confirmAppointmentTime(timeConfirmAppointment.value.id);
  timeConfirmStep.value = 'success';
};

const resetTimeConfirm = () => {
  timeConfirmAppointment.value = null;
  timeConfirmStep.value = 'form';
};

const onTimeConfirmClosed = () => {
  closeTimeConfirmPanel();
  resetTimeConfirm();
};

const handleAcceptanceConfirm = () => {
  if (!acceptanceAppointment.value) return;
  confirmAppointmentAcceptance(acceptanceAppointment.value.id);
  acceptanceAccepted.value = true;
  acceptanceStep.value = 'success';
};
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

.action-btn {
  height: 72rpx;
  padding: 0 36rpx;
  border-radius: 1998rpx;
  background-color: #9fe870;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-sizing: border-box;
}

.action-btn-muted {
  background-color: #e5e7eb;
}

.action-btn-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #163300;
  line-height: 1;
}

.action-btn-muted .action-btn-text {
  color: #4b5563;
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
