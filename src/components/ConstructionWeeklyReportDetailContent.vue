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

        <view v-if="chapter.id === 'progress'" class="section-list">
          <view class="section-card anchor-size-card">
            <view class="progress-block">
              <view class="progress-head">
                <text class="progress-label">{{ t('construction.currentProgress') }}</text>
                <text class="progress-value">{{ currentProgressPercent }}%</text>
              </view>
              <view class="progress-track">
                <view
                  class="progress-fill progress-fill--current"
                  :style="{ width: currentProgressPercent + '%' }"
                />
              </view>
            </view>
            <view class="progress-block">
              <view class="progress-head">
                <text class="progress-label">{{ t('construction.plannedProgress') }}</text>
                <text class="progress-value">{{ plannedProgressPercent }}%</text>
              </view>
              <view class="progress-track">
                <view
                  class="progress-fill progress-fill--planned"
                  :style="{ width: plannedProgressPercent + '%' }"
                />
              </view>
            </view>
          </view>
          <view class="section-card">
            <text class="section-title">{{ t('construction.mainContent') }}</text>
            <textarea
              class="field-textarea"
              :value="detail.laborArrangement"
              disabled
              auto-height
            />
          </view>
          <view class="section-card">
            <text class="section-title">{{ t('construction.deviation') }}</text>
            <textarea
              class="field-textarea"
              :value="detail.deviationAction"
              disabled
              auto-height
            />
          </view>
        </view>

        <view v-else-if="chapterCards[chapter.id]" class="section-list">
          <view
            v-for="card in chapterCards[chapter.id]"
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
          v-else-if="chapter.id === 'photos'"
          title=""
          :files="detail.photos"
          :empty-text="t('construction.noSitePhotos')"
        />

        <FileAttachmentCard
          v-else
          title=""
          :files="detail.acceptance"
          :empty-text="t('construction.noAcceptanceRecords')"
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
  WEEKLY_REPORT_TABS,
  useConstructionReports,
  type ConstructionReportItem,
  type WeeklyReportSection,
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

const { getWeeklyDetail } = useConstructionReports();
const chapterKeys = {
  progress: 'construction.weeklyProgress',
  quality: 'construction.weeklyQuality',
  issues: 'construction.weeklyIssues',
  nextWeek: 'construction.weeklyNext',
  others: 'construction.weeklyOther',
  photos: 'construction.weeklyPhotos',
  acceptance: 'construction.weeklyAcceptance',
} as const;
const chapters = computed(() =>
  WEEKLY_REPORT_TABS.map((chapter) => ({
    ...chapter,
    label: t(chapterKeys[chapter.id]),
  })),
);
const chapterDomId = (id: string) => reportChapterDomId('weekly-chapter', id);

const detail = computed(() => getWeeklyDetail(props.item.id));

const clampPercent = (value: number) =>
  Math.max(0, Math.min(100, Math.round(value)));

const currentProgressPercent = computed(() =>
  clampPercent(detail.value.currentProgress),
);
const plannedProgressPercent = computed(() =>
  clampPercent(detail.value.plannedProgress),
);

const chapterCards = computed(() => {
  const data = detail.value;
  return {
    quality: [
      { title: t('construction.qualityAcceptance'), value: data.qualityAcceptance },
      { title: t('construction.problemRectification'), value: data.qualityRectification },
    ],
    issues: [
      { title: t('construction.siteIssues'), value: data.siteIssues },
      { title: t('construction.solutionProgress'), value: data.issueSolution },
    ],
    nextWeek: [
      { title: t('construction.plannedContent'), value: data.plannedContent },
      { title: t('construction.resourceNeeds'), value: data.resourceDemand },
    ],
    others: [
      { title: t('construction.ownerConfirmation'), value: data.ownerConfirmItems },
      { title: t('construction.otherItems'), value: data.otherOutstandingItems },
    ],
  } as Partial<Record<WeeklyReportSection, { title: string; value: string }[]>>;
});

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

.progress-block + .progress-block {
  margin-top: 40rpx;
}

.progress-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  margin-bottom: 16rpx;
}

.progress-label {
  font-size: 28rpx;
  font-weight: 600;
  color: #6b7280;
  line-height: 1.35;
}

.progress-value {
  font-size: 28rpx;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

.progress-track {
  height: 20rpx;
  border-radius: 999rpx;
  background-color: #eef0ea;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999rpx;
}

.progress-fill--current {
  background-color: #9fe870;
}

.progress-fill--planned {
  background-color: #86a8c9;
}
</style>
