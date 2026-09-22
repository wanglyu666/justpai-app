<template>
  <view class="project-list-page" @click="closeMenu">
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
          placeholder="搜索维保项目"
          placeholder-class="search-placeholder"
        />
      </view>
    </view>

    <view class="content">
      <view class="title-row">
        <view class="title-block">
          <text class="page-title">维保项目管理</text>
          <text class="page-desc">查看全部维保项目信息</text>
        </view>
      </view>

      <StatusCapsuleSwitch
        class="status-capsule-wrap"
        v-model="activeStatus"
        :tabs="statusTabs"
        equal
      />

      <view class="ticket-list">
        <view
          v-for="item in filteredProjects"
          :key="item.id"
          class="ticket-card"
          :class="menuOpenId === item.id ? 'is-menu-open' : ''"
          @click="openDetail(item)"
        >
          <view class="card-heading">
            <view class="card-heading-block">
              <text class="card-title">{{ item.name }}</text>
              <text class="card-code">{{ item.code }}</text>
            </view>
            <view class="card-menu-btn" @click.stop="toggleMenu(item.id)">
              <image
                src="/static/icons/caret-down.svg"
                mode="aspectFit"
                class="card-menu-icon"
                :class="menuOpenId === item.id ? 'is-open' : ''"
              />
            </view>
            <view
              v-if="menuOpenId === item.id"
              class="card-dropdown"
              @click.stop
            >
              <view
                v-for="entry in actionEntries"
                :key="entry.id"
                class="card-dropdown-item"
                @click.stop="openMenuAction(item, entry.id)"
              >
                <image
                  :src="entry.icon"
                  mode="aspectFit"
                  class="card-dropdown-icon"
                />
                <text class="card-dropdown-text">{{ entry.label }}</text>
              </view>
            </view>
          </view>

          <view class="list-card-meta">
            <view class="list-card-meta-item">
              <view class="manager-avatar">
                <text class="manager-avatar-text">{{ item.managerName.slice(0, 1) }}</text>
              </view>
              <view class="list-card-meta-text">
                <text class="info-label">项目负责人</text>
                <text class="info-value">{{ item.managerName }}</text>
              </view>
            </view>
            <view class="list-card-meta-divider" />
            <view class="list-card-meta-item">
              <view class="list-card-meta-text">
                <text class="info-label">联系方式</text>
                <text class="info-value">{{ formatPhone(item.managerPhone) }}</text>
              </view>
            </view>
          </view>
        </view>

        <view v-if="filteredProjects.length === 0" class="empty-tip">
          <text class="empty-tip-text">暂无相关维保项目</text>
        </view>
      </view>
    </view>

    <BottomSheetPanel
      :show="detailVisible"
      :z-index="2200"
      @closed="resetDetail"
    >
      <view class="sheet-page" v-if="selectedItem">
        <view class="sheet-page__header">
          <view class="sheet-page__back-btn" @click="closeDetail">
            <image
              src="/static/icons/chevron-left.svg"
              mode="aspectFit"
              class="sheet-page__back-icon"
            />
          </view>
        </view>

        <view class="sheet-page__body">
          <text class="sheet-page__title">项目详情</text>

          <view class="info-card">
            <view class="card-heading">
              <view class="card-heading-block">
                <text class="card-title">{{ selectedItem.name }}</text>
              </view>
              <StatusBadge
                :status="selectedItem.status"
                :label="statusLabel(selectedItem.status)"
              />
            </view>

            <view class="info-grid">
              <view class="info-row">
                <view class="info-field">
                  <text class="info-label">项目负责人</text>
                  <text class="info-value">{{ selectedItem.managerName }}</text>
                </view>
                <view class="info-field">
                  <text class="info-label">联系方式</text>
                  <text class="info-value">{{ formatPhone(selectedItem.managerPhone) }}</text>
                </view>
              </view>
              <view class="info-row">
                <view class="info-field">
                  <text class="info-label">项目编号</text>
                  <text class="info-value">{{ selectedItem.code }}</text>
                </view>
              </view>
            </view>
          </view>

          <view class="action-card-row">
            <ActionSquareCard
              icon="/static/icons/calendar-clock.svg"
              label="预约管理"
              @click="openAppointment"
            />
            <ActionSquareCard
              icon="/static/icons/star-yellow.svg"
              label="评价"
              @click="openReview"
            />
          </view>
        </view>
      </view>
    </BottomSheetPanel>

    <SlideOverPanel
      :show="appointmentVisible"
      :z-index="2300"
    >
      <AppointmentManageContent
        v-if="selectedItem"
        :project-id="selectedItem.id"
        @back="closeAppointment"
      />
    </SlideOverPanel>

    <SlideOverPanel
      :show="reviewVisible"
      :z-index="2300"
      @closed="resetReviewFlow"
    >
      <SuccessPageTransition :show-success="reviewStep === 'success'">
        <OrderReviewContent
          v-if="reviewSubject"
          :subject="reviewSubject"
          form-title="项目评价"
          :editable="reviewStep === 'form'"
          :existing-rating="reviewRecord?.rating"
          :existing-content="reviewRecord?.content"
          :submitted-at="reviewRecord?.submittedAt"
          @back="closeReview"
          @submit="handleReviewSubmit"
        />
        <template #success>
          <OrderReviewSuccessContent back-text="返回项目" @back="closeReview" />
        </template>
      </SuccessPageTransition>
    </SlideOverPanel>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import StatusCapsuleSwitch from '@/components/StatusCapsuleSwitch.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import ActionSquareCard from '@/components/ActionSquareCard.vue';
import BottomSheetPanel from '@/components/BottomSheetPanel.vue';
import SlideOverPanel from '@/components/SlideOverPanel.vue';
import SuccessPageTransition from '@/components/SuccessPageTransition.vue';
import OrderReviewContent from '@/components/OrderReviewContent.vue';
import OrderReviewSuccessContent from '@/components/OrderReviewSuccessContent.vue';
import AppointmentManageContent from '@/components/AppointmentManageContent.vue';
import {
  useMaintenanceProjects,
  type MaintenanceProjectItem,
  type MaintenanceProjectStatus,
} from '@/composables/useMaintenanceProjects';
import { useOrderReviews } from '@/composables/useOrderReviews';
import { useSlideOver } from '@/composables/useSlideOver';
import { usePageBack, usePageBackWhen } from '@/composables/usePageBack';

const props = withDefaults(
  defineProps<{
    initialStatus?: MaintenanceProjectStatus;
  }>(),
  {
    initialStatus: 'completed',
  },
);

const emit = defineEmits<{
  back: [];
}>();

const { projects } = useMaintenanceProjects();
const keyword = ref('');
const activeStatus = ref<MaintenanceProjectStatus>(props.initialStatus);
watch(
  () => props.initialStatus,
  (status) => {
    activeStatus.value = status;
  },
);
const selectedItem = ref<MaintenanceProjectItem | null>(null);
const menuOpenId = ref<number | null>(null);
const {
  visible: detailVisible,
  open: openDetailPanel,
  close: closeDetail,
} = useSlideOver();
usePageBackWhen(detailVisible, closeDetail);

const {
  visible: appointmentVisible,
  open: openAppointmentPanel,
  close: closeAppointment,
} = useSlideOver();

const {
  visible: reviewVisible,
  open: openReviewPanel,
  close: closeReview,
} = useSlideOver();
const reviewStep = ref<'form' | 'view' | 'success'>('form');
const { hasReview, getReview, submitReview } = useOrderReviews();

const projectReviewId = (projectId: number) => `project-${projectId}`;

const reviewSubject = computed(() =>
  selectedItem.value
    ? {
        id: projectReviewId(selectedItem.value.id),
        name: selectedItem.value.name,
        code: selectedItem.value.code,
        codeLabel: '项目编号',
      }
    : null,
);

const reviewRecord = computed(() =>
  selectedItem.value ? getReview(projectReviewId(selectedItem.value.id)) : null,
);

const statusTabs: { id: MaintenanceProjectStatus; label: string }[] = [
  { id: 'pending_start', label: '待开工' },
  { id: 'in_progress', label: '施工中' },
  { id: 'completed', label: '已完工' },
];

const STATUS_LABEL: Record<MaintenanceProjectStatus, string> = {
  pending_start: '待开工',
  in_progress: '施工中',
  completed: '已完工',
};

const statusLabel = (status: MaintenanceProjectStatus) => STATUS_LABEL[status];

const actionEntries = [
  { id: 'appointment', label: '预约管理', icon: '/static/icons/calendar-clock.svg' },
  { id: 'review', label: '评价', icon: '/static/icons/star-yellow.svg' },
] as const;

const filteredProjects = computed(() => {
  const q = keyword.value.trim().toLowerCase();
  return projects.value.filter((item) => {
    if (item.status !== activeStatus.value) return false;
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.address.toLowerCase().includes(q) ||
      item.managerName.toLowerCase().includes(q) ||
      item.startDate.includes(q) ||
      item.endDate.includes(q)
    );
  });
});

const openDetail = (item: MaintenanceProjectItem) => {
  closeMenu();
  selectedItem.value = { ...item, attachments: [...item.attachments] };
  openDetailPanel();
};

const closeMenu = () => {
  menuOpenId.value = null;
};

const toggleMenu = (id: number) => {
  menuOpenId.value = menuOpenId.value === id ? null : id;
};

watch(activeStatus, closeMenu);

const openMenuAction = (
  item: MaintenanceProjectItem,
  id: (typeof actionEntries)[number]['id'],
) => {
  closeMenu();
  selectedItem.value = { ...item, attachments: [...item.attachments] };
  handleActionClick(id);
};

const handleActionClick = (id: (typeof actionEntries)[number]['id']) => {
  if (id === 'appointment') openAppointment();
  if (id === 'review') openReview();
};

const formatPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  return phone;
};

const resetDetail = () => {
  selectedItem.value = null;
  closeAppointment();
};

const openAppointment = () => {
  if (!selectedItem.value) return;
  openAppointmentPanel();
};

const openReview = () => {
  if (!selectedItem.value) return;
  reviewStep.value = hasReview(projectReviewId(selectedItem.value.id)) ? 'view' : 'form';
  openReviewPanel();
};

const resetReviewFlow = () => {
  reviewStep.value = 'form';
};

const handleReviewSubmit = (payload: { id: string; rating: number; content: string }) => {
  submitReview(payload.id, {
    rating: payload.rating,
    content: payload.content,
  });
  reviewStep.value = 'success';
};

const handleBack = usePageBack(() => emit('back'));
</script>

<style scoped>
.project-list-page {
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

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  margin-bottom: 32rpx;
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

.status-capsule-wrap {
  margin-bottom: 48rpx;
}

.ticket-list {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  overflow: visible;
}

.ticket-card {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 40rpx;
  padding: 40rpx 36rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 36rpx;
  overflow: visible;
}

.ticket-card.is-menu-open {
  z-index: 8;
}

.card-menu-btn {
  width: 56rpx;
  height: 56rpx;
  margin-top: 4rpx;
  margin-right: -8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-menu-icon {
  width: 44rpx;
  height: 44rpx;
  transition: transform 180ms ease;
}

.card-menu-icon.is-open {
  transform: rotate(180deg);
}

.card-dropdown {
  position: absolute;
  top: calc(100% + 8rpx);
  right: -20rpx;
  z-index: 30;
  width: max-content;
  min-width: 268rpx;
  padding: 8rpx 0;
  background-color: #ffffff;
  border-radius: 28rpx;
  box-shadow: 0 16rpx 48rpx rgba(15, 23, 42, 0.14);
  border: 2rpx solid #f3f4f6;
  box-sizing: border-box;
}

.card-dropdown-item {
  min-height: 88rpx;
  margin: 0 22rpx;
  padding: 0 6rpx;
  display: flex;
  align-items: center;
  gap: 18rpx;
  box-sizing: border-box;
  border-bottom: 2rpx solid #eef2f7;
}

.card-dropdown-item:last-child {
  border-bottom: none;
}

.card-dropdown-icon {
  width: 44rpx;
  height: 44rpx;
  flex-shrink: 0;
}

.card-dropdown-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
  white-space: nowrap;
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

.sheet-page__body {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.action-card-row {
  display: flex;
  gap: 24rpx;
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

.card-heading {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
}

.card-heading-block {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.card-title {
  font-size: 36rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.35;
}

.card-code {
  font-size: 26rpx;
  color: #9ca3af;
  line-height: 1.2;
}

.list-card-meta {
  padding: 28rpx;
  border-radius: 32rpx;
  background-color: #f8fafc;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.list-card-meta-item {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.list-card-meta-text {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  min-width: 0;
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

.list-card-meta-divider {
  width: 2rpx;
  height: 56rpx;
  background-color: #e5e7eb;
  flex-shrink: 0;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
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

.info-field-full {
  flex: 1 1 100%;
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
</style>
