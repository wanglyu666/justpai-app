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
          <text class="page-desc">查看施工现场报告记录</text>
        </view>
      </view>

      <StatusCapsuleSwitch
        class="status-capsule-wrap"
        v-model="activeSection"
        :tabs="sectionTabs"
      />

      <view v-if="activeSection === 'summary'" class="section-list">
        <view class="section-card">
          <text class="section-title">本周开展的特殊作业</text>
          <textarea
            class="field-textarea"
            :value="detail.specialOperations"
            disabled
            auto-height
          />
        </view>
        <view class="section-card stat-card">
          <view class="stat-row">
            <text class="stat-label">本周开展的安全教育次数</text>
            <view class="stat-num">
              <text class="stat-count">{{ detail.safetyEducationCount }}</text>
              <text class="stat-unit">次</text>
            </view>
          </view>
          <view class="stat-divider" />
          <view class="stat-row">
            <text class="stat-label">共开展教育与培训总结</text>
            <view class="stat-num">
              <text class="stat-count">{{ detail.trainingSummaryCount }}</text>
              <text class="stat-unit">次</text>
            </view>
          </view>
        </view>
        <view class="section-card">
          <text class="section-title">本周开展的教育培训</text>
          <textarea
            class="field-textarea"
            :value="detail.educationTraining"
            disabled
            auto-height
          />
        </view>
      </view>

      <view v-else-if="textCards.length" class="section-list">
        <view
          v-for="card in textCards"
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
        title="培训照片"
        :files="detail.trainingPhotos"
        empty-text="暂无培训照片"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import StatusCapsuleSwitch from '@/components/StatusCapsuleSwitch.vue';
import FileAttachmentCard from '@/components/FileAttachmentCard.vue';
import {
  EHS_REPORT_TABS,
  useConstructionReports,
  type ConstructionReportItem,
  type EhsReportSection,
} from '@/composables/useConstructionReports';
import { usePageBack } from '@/composables/usePageBack';

const props = defineProps<{
  item: ConstructionReportItem;
}>();

const emit = defineEmits<{
  back: [];
}>();

const { getEhsDetail } = useConstructionReports();
const sectionTabs = EHS_REPORT_TABS;
const activeSection = ref<EhsReportSection>('summary');

const detail = computed(() => getEhsDetail(props.item.id));

const textCards = computed(() => {
  const data = detail.value;
  if (activeSection.value === 'nextPlan') {
    return [{ title: '下周工作计划', value: data.nextPlan }];
  }
  if (activeSection.value === 'hazards') {
    return [
      { title: '隐患排查', value: data.hazardInspection },
      { title: '其他事项', value: data.otherItems },
    ];
  }
  return [];
});

watch(
  () => props.item.id,
  () => {
    activeSection.value = 'summary';
  },
);

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

.stat-card {
  padding: 16rpx 36rpx;
}

.stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32rpx;
  padding: 28rpx 0;
}

.stat-divider {
  height: 2rpx;
  background-color: #eef0ea;
}

.stat-label {
  flex: 1;
  min-width: 0;
  font-size: 28rpx;
  font-weight: 500;
  color: #6b7280;
  line-height: 1.45;
}

.stat-num {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
  flex-shrink: 0;
}

.stat-count {
  font-size: 44rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1;
}

.stat-unit {
  font-size: 24rpx;
  font-weight: 600;
  color: #9ca3af;
  line-height: 1;
}
</style>
