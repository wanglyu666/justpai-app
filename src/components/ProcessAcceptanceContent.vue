<template>
  <view class="report-page">
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
          placeholder="搜索材料"
          placeholder-class="search-placeholder"
        />
      </view>
    </view>

    <view class="content">
      <view class="title-row">
        <view class="title-block">
          <text class="page-title">过程验收</text>
          <text class="page-desc">查看材料与进度验收记录</text>
        </view>
      </view>

      <StatusCapsuleSwitch
        class="status-capsule-wrap"
        v-model="activeCategory"
        :tabs="tabs"
        equal
      />

      <view class="report-list">
        <view v-for="item in visibleItems" :key="item.id" class="report-card">
          <view v-if="activeCategory === 'arrival'" class="card-head">
            <view class="info-icon-wrap">
              <image :src="categoryIcon" mode="aspectFit" class="info-icon" />
            </view>
            <text class="card-title">{{ item.name }}</text>
          </view>
          <view v-else class="card-head card-head-progress">
            <text class="card-title">{{ item.name }}</text>
            <StatusBadge
              v-if="item.acceptStatus"
              :status="item.acceptStatus"
              :label="acceptStatusLabel(item.acceptStatus)"
            />
          </view>

          <view v-if="activeCategory === 'arrival'" class="info-grid">
            <view class="info-row">
              <view class="info-field">
                <text class="info-label">品牌</text>
                <text class="info-value">{{ item.brand }}</text>
              </view>
              <view class="info-field">
                <text class="info-label">型号</text>
                <text class="info-value">{{ displayText(item.model) }}</text>
              </view>
            </view>
            <view class="info-row">
              <view class="info-field">
                <text class="info-label">单位</text>
                <text class="info-value">{{ item.unit }}</text>
              </view>
              <view class="info-field">
                <text class="info-label">数量</text>
                <text class="info-value">{{ displayText(item.quantity) }}</text>
              </view>
            </view>
            <view class="info-row">
              <view class="info-field">
                <text class="info-label">计划进场时间</text>
                <text class="info-value">{{ displayText(item.plannedAt) }}</text>
              </view>
              <view class="info-field">
                <text class="info-label">实际进场时间</text>
                <text class="info-value">{{ displayText(item.actualAt) }}</text>
              </view>
            </view>
            <view class="info-row">
              <view class="info-field">
                <text class="info-label">备注</text>
                <text class="info-value">{{ displayText(item.remark) }}</text>
              </view>
            </view>
          </view>

          <view v-else class="info-grid">
            <view class="info-row">
              <view class="info-field">
                <text class="info-label">计划验收时间</text>
                <text class="info-value">{{ displayText(item.plannedAt) }}</text>
              </view>
              <view class="info-field">
                <text class="info-label">预约验收时间</text>
                <text class="info-value">{{ displayText(item.bookedAt) }}</text>
              </view>
            </view>
            <view class="info-row">
              <view class="info-field">
                <text class="info-label">验收类型</text>
                <text class="info-value">{{ displayText(item.acceptType) }}</text>
              </view>
            </view>
            <view class="card-action-row">
              <view class="book-btn book-btn-muted" @click.stop="openRectify(item)">
                <text class="book-btn-text">缺陷整改</text>
              </view>
              <view class="book-btn" @click.stop="openBook(item)">
                <text class="book-btn-text">预约时间</text>
              </view>
            </view>
          </view>
        </view>

        <view v-if="visibleItems.length === 0" class="empty-tip">
          <text class="empty-tip-text">暂无相关记录</text>
        </view>
      </view>
    </view>

    <SlideOverPanel
      :show="rectifyVisible"
      :z-index="2400"
      @closed="resetRectify"
    >
      <DefectRectificationListContent
        v-if="rectifyTarget"
        :acceptance-item-id="rectifyTarget.id"
        @back="closeRectify"
      />
    </SlideOverPanel>

    <SlideOverPanel
      :show="bookVisible"
      :z-index="2400"
      content-safe-top
      @closed="resetBook"
    >
      <SuccessPageTransition :show-success="bookStep === 'success'">
        <AppointmentAcceptanceContent
          v-if="bookTarget"
          :item="bookTarget"
          @back="closeBook"
          @submit="handleBookSubmit"
        />
        <template #success>
          <FeedbackSuccessContent
            desc="您的预约验收已提交，我们将尽快处理"
            back-text="返回过程验收"
            @back="closeBook"
          />
        </template>
      </SuccessPageTransition>
    </SlideOverPanel>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import StatusCapsuleSwitch from '@/components/StatusCapsuleSwitch.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import SlideOverPanel from '@/components/SlideOverPanel.vue';
import DefectRectificationListContent from '@/components/DefectRectificationListContent.vue';
import AppointmentAcceptanceContent from '@/components/AppointmentAcceptanceContent.vue';
import SuccessPageTransition from '@/components/SuccessPageTransition.vue';
import FeedbackSuccessContent from '@/components/FeedbackSuccessContent.vue';
import {
  PROCESS_ACCEPTANCE_ICONS,
  PROGRESS_ACCEPT_STATUS_LABEL,
  useProcessAcceptance,
  type ProcessAcceptanceCategory,
  type ProcessAcceptanceItem,
  type ProgressAcceptStatus,
  type ProgressAcceptType,
  type SiteContact,
} from '@/composables/useProcessAcceptance';
import { useSlideOver } from '@/composables/useSlideOver';
import { usePageBack, usePageBackWhen } from '@/composables/usePageBack';

const emit = defineEmits<{
  back: [];
}>();

const { tabs, getByCategory, updateProgressBooking } = useProcessAcceptance();
const activeCategory = ref<ProcessAcceptanceCategory>('arrival');
const keyword = ref('');
const rectifyTarget = ref<ProcessAcceptanceItem | null>(null);
const bookTarget = ref<ProcessAcceptanceItem | null>(null);
const bookStep = ref<'form' | 'success'>('form');
const {
  visible: rectifyVisible,
  open: openRectifyPanel,
  close: closeRectify,
} = useSlideOver();
usePageBackWhen(rectifyVisible, closeRectify);
const {
  visible: bookVisible,
  open: openBookPanel,
  close: closeBook,
} = useSlideOver();
usePageBackWhen(bookVisible, closeBook);

const categoryItems = computed(() => getByCategory(activeCategory.value));

const visibleItems = computed(() => {
  const q = keyword.value.trim().toLowerCase();
  if (!q) return categoryItems.value;
  return categoryItems.value.filter((item) => matchItem(item, q));
});

const categoryIcon = computed(
  () => PROCESS_ACCEPTANCE_ICONS[activeCategory.value],
);

const displayText = (value?: string) => {
  const text = (value || '').trim();
  return !text || text === '-' ? '—' : text;
};

const acceptStatusLabel = (status: ProgressAcceptStatus) =>
  PROGRESS_ACCEPT_STATUS_LABEL[status];

const matchItem = (item: ProcessAcceptanceItem, q: string) => {
  const statusText = item.acceptStatus
    ? PROGRESS_ACCEPT_STATUS_LABEL[item.acceptStatus]
    : '';
  const fields = [
    item.specialty,
    item.kind,
    item.code,
    item.name,
    item.brand,
    item.spec,
    item.unit,
    item.remark,
    item.model,
    item.quantity,
    item.plannedAt,
    item.actualAt,
    item.bookedAt,
    item.acceptType,
    statusText,
  ];
  return fields.some((value) => (value || '').toLowerCase().includes(q));
};

const handleBack = usePageBack(() => emit('back'));

const openRectify = (item: ProcessAcceptanceItem) => {
  rectifyTarget.value = item;
  openRectifyPanel();
};

const resetRectify = () => {
  rectifyTarget.value = null;
};

const openBook = (item: ProcessAcceptanceItem) => {
  bookTarget.value = item;
  bookStep.value = 'form';
  openBookPanel();
};

const resetBook = () => {
  bookTarget.value = null;
  bookStep.value = 'form';
};

const handleBookSubmit = (payload: {
  bookedAt: string;
  acceptType: ProgressAcceptType;
  contacts: SiteContact[];
}) => {
  const id = bookTarget.value?.id;
  if (!id) return;
  updateProgressBooking(id, payload);
  bookStep.value = 'success';
};
</script>

<style scoped>
.report-page {
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

.report-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.report-card {
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 40rpx;
  padding: 40rpx 36rpx;
  display: flex;
  flex-direction: column;
  gap: 36rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.card-head {
  display: flex;
  align-items: center;
  gap: 20rpx;
  min-width: 0;
}

.card-head-progress {
  align-items: flex-start;
  justify-content: space-between;
  gap: 24rpx;
}

.info-icon-wrap {
  width: 72rpx;
  height: 72rpx;
  border-radius: 20rpx;
  background-color: rgba(37, 99, 235, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon {
  width: 40rpx;
  height: 40rpx;
  display: block;
}

.card-title {
  flex: 1;
  min-width: 0;
  font-size: 36rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.35;
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

.card-action-row {
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
}

.book-btn {
  height: 72rpx;
  padding: 0 36rpx;
  border-radius: 1998rpx;
  background-color: #9fe870;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.book-btn-muted {
  background-color: #e5e7eb;
}

.book-btn-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #163300;
  line-height: 1;
}

.book-btn-muted .book-btn-text {
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
