<template>
  <view class="report-detail-page">
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
          <text class="page-title">{{ item.title }}</text>
          <text class="page-desc">{{ t('construction.reportDescription') }}</text>
        </view>
        <ReportFeedbackAction :report-id="item.id" />
      </view>

      <view
        v-for="chapter in chapters"
        :key="chapter.id"
        class="report-chapter"
      >
        <text :id="chapterDomId(chapter.id)" class="report-chapter-heading">{{ chapter.label }}</text>

        <view v-if="chapter.id === 'content'" class="section-list">
          <view class="section-card">
            <text class="section-title">{{ t('construction.area') }}</text>
            <textarea
              class="field-textarea"
              :value="detail.area"
              disabled
              auto-height
            />
          </view>
          <view class="section-card">
            <text class="section-title">{{ t('construction.progress') }}</text>
            <textarea
              class="field-textarea"
              :value="detail.progress"
              disabled
              auto-height
            />
          </view>
          <view class="section-card anchor-size-card">
            <text class="section-title">{{ t('construction.content') }}</text>
            <textarea
              class="field-textarea"
              :value="detail.content"
              disabled
              auto-height
            />
          </view>
        </view>

        <view v-else-if="chapter.id === 'trades'" class="section-list">
          <view class="section-card">
            <text class="section-title">{{ t('construction.workforce') }}</text>
            <view class="trade-table">
              <view class="trade-row trade-row--head">
                <text class="trade-cell">{{ t('construction.trade') }}</text>
                <text class="trade-cell trade-cell--count">{{ t('construction.quantity') }}</text>
              </view>
              <view
                v-for="(staff, index) in detail.tradeStaff"
                :key="`${staff.name}-${index}`"
                class="trade-row"
              >
                <text class="trade-cell">{{ staff.name }}</text>
                <text class="trade-cell trade-cell--count">{{ staff.count }}</text>
              </view>
            </view>
          </view>
          <view class="section-card">
            <text class="section-title">{{ t('construction.materials') }}</text>
            <textarea
              class="field-textarea"
              :value="detail.materials"
              disabled
              auto-height
            />
          </view>
        </view>

        <view v-else-if="chapter.id === 'plan'" class="section-list">
          <view
            v-for="card in planCards"
            :key="card.title"
            class="section-card"
          >
            <text class="section-title">{{ card.title }}</text>
            <textarea
              class="field-textarea"
              :value="card.value"
              disabled
              auto-height
            />
          </view>
        </view>

        <FileAttachmentCard
          v-else
          title=""
          :files="detail.photos"
          :empty-text="t('construction.noConstructionPhotos')"
        />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import FileAttachmentCard from '@/components/FileAttachmentCard.vue';
import ReportFeedbackAction from '@/components/ReportFeedbackAction.vue';
import {
  DAILY_REPORT_TABS,
  useConstructionReports,
  type ConstructionReportItem,
} from '@/composables/useConstructionReports';
import { reportChapterDomId } from '@/composables/useReportChapterNav';
import { usePageBack } from '@/composables/usePageBack';
import { useLanguage } from '@/composables/useLanguage';

const props = defineProps<{
  item: ConstructionReportItem;
}>();

const emit = defineEmits<{
  back: [];
}>();

const { t } = useLanguage();

const { getDailyDetail } = useConstructionReports();
const chapterKeys = {
  content: 'construction.dailyContent',
  trades: 'construction.dailyTrades',
  plan: 'construction.dailyPlan',
  photos: 'construction.dailyPhotos',
} as const;
const chapters = computed(() =>
  DAILY_REPORT_TABS.map((chapter) => ({
    ...chapter,
    label: t(chapterKeys[chapter.id]),
  })),
);
const chapterDomId = (id: string) => reportChapterDomId('daily-chapter', id);

const detail = computed(() => getDailyDetail(props.item.id));

const planCards = computed(() => [
  { title: t('construction.issueResolution'), value: detail.value.issueResolution },
  { title: t('construction.nextDayContent'), value: detail.value.nextDayContent },
  { title: t('construction.nextDayArea'), value: detail.value.nextDayArea },
  { title: t('construction.nextDayStaff'), value: detail.value.nextDayStaff },
]);

const handleBack = usePageBack(() => emit('back'));
</script>

<style scoped>
.report-detail-page {
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
  margin-bottom: 56rpx;
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

.section-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.section-card {
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 40rpx;
  padding: 36rpx 32rpx;
  box-shadow: 0 4rpx 24rpx rgba(15, 23, 42, 0.04);
}

.section-title {
  display: block;
  font-size: 32rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.35;
  margin-bottom: 24rpx;
}

.field-textarea {
  width: 100%;
  min-height: 160rpx;
  padding: 24rpx 28rpx;
  background-color: #f8faf9;
  border: 2rpx solid #eef0ea;
  border-radius: 28rpx;
  font-size: 28rpx;
  color: #374151;
  line-height: 1.55;
  box-sizing: border-box;
}

.trade-table {
  width: 100%;
  background-color: #f8faf9;
  border: 2rpx solid #eef0ea;
  border-radius: 28rpx;
  overflow: hidden;
  box-sizing: border-box;
}

.trade-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  padding: 28rpx 28rpx;
  border-bottom: 2rpx solid #eef0ea;
  box-sizing: border-box;
}

.trade-row:last-child {
  border-bottom: none;
}

.trade-row--head {
  padding-top: 22rpx;
  padding-bottom: 22rpx;
}

.trade-cell {
  flex: 1;
  min-width: 0;
  font-size: 28rpx;
  color: #111827;
  line-height: 1.35;
}

.trade-row--head .trade-cell {
  color: #9ca3af;
  font-weight: 500;
}

.trade-cell--count {
  flex: 0 0 auto;
  text-align: right;
}
</style>
