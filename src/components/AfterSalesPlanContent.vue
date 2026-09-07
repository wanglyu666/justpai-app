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
    </view>

    <view class="content">
      <view class="title-row">
        <view class="title-block">
          <text class="page-title">售后计划</text>
          <text class="page-desc">查看项目售后巡检计划</text>
        </view>
      </view>

      <view class="report-list">
        <view v-for="item in plans" :key="item.id" class="report-card">
          <text class="card-title" :style="infoCardTitleStyle">{{ item.name }}</text>

          <view class="info-grid">
            <view class="info-row">
              <view class="info-field" :style="infoCardFieldStyle">
                <text class="info-label" :style="infoCardLabelStyle">计划时间</text>
                <text class="info-value" :style="infoCardValueStyle">{{ displayText(item.plannedAt) }}</text>
              </view>
              <view class="info-field" :style="infoCardFieldStyle">
                <text class="info-label" :style="infoCardLabelStyle">开始时间</text>
                <text class="info-value" :style="infoCardValueStyle">{{ displayText(item.startedAt) }}</text>
              </view>
            </view>
            <view class="info-row info-row-end">
              <view class="info-field" :style="infoCardFieldStyle">
                <text class="info-label" :style="infoCardLabelStyle">结束时间</text>
                <text class="info-value" :style="infoCardValueStyle">{{ displayText(item.endedAt) }}</text>
              </view>
              <view class="info-field info-field-action">
                <view v-if="item.canBook" class="book-btn" @click.stop="openBook(item)">
                  <text class="book-btn-text">预约巡检时间</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view v-if="plans.length === 0" class="empty-tip">
          <text class="empty-tip-text">暂无售后计划</text>
        </view>
      </view>
    </view>

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
          :hide-accept-type="true"
          @back="closeBook"
          @submit="handleBookSubmit"
        />
        <template #success>
          <FeedbackSuccessContent
            desc="您的预约验收已提交，我们将尽快处理"
            back-text="返回售后计划"
            @back="closeBook"
          />
        </template>
      </SuccessPageTransition>
    </SlideOverPanel>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SlideOverPanel from '@/components/SlideOverPanel.vue';
import AppointmentAcceptanceContent from '@/components/AppointmentAcceptanceContent.vue';
import SuccessPageTransition from '@/components/SuccessPageTransition.vue';
import FeedbackSuccessContent from '@/components/FeedbackSuccessContent.vue';
import {
  infoCardFieldStyle,
  infoCardLabelStyle,
  infoCardTitleStyle,
  infoCardValueStyle,
} from '@/config/infoCard';
import {
  useAfterSalesPlans,
  type AfterSalesPlanItem,
} from '@/composables/useAfterSalesPlans';
import type { ProgressAcceptType, SiteContact } from '@/composables/useProcessAcceptance';
import { useSlideOver } from '@/composables/useSlideOver';
import { usePageBack, usePageBackWhen } from '@/composables/usePageBack';

const emit = defineEmits<{
  back: [];
}>();

const { plans, updateBooking } = useAfterSalesPlans();
const bookTarget = ref<AfterSalesPlanItem | null>(null);
const bookStep = ref<'form' | 'success'>('form');
const {
  visible: bookVisible,
  open: openBookPanel,
  close: closeBook,
} = useSlideOver();
usePageBackWhen(bookVisible, closeBook);

const displayText = (value?: string) => {
  const text = (value || '').trim();
  return !text || text === '-' ? '—' : text;
};

const handleBack = usePageBack(() => emit('back'));

const openBook = (item: AfterSalesPlanItem) => {
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
  updateBooking(id, payload);
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

.card-title {
  min-width: 0;
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

.info-row-end {
  align-items: center;
}

.info-field {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.info-field-action {
  align-items: flex-end;
  justify-content: center;
}

.info-label,
.info-value {
  word-break: break-all;
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

.book-btn-text {
  font-size: 28rpx;
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
</style>
