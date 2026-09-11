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

      <view v-if="activeSection === 'content'" class="section-list">
        <view class="section-card">
          <text class="section-title">施工区域</text>
          <textarea
            class="field-textarea"
            :value="detail.area"
            disabled
            auto-height
          />
        </view>
        <view class="section-card">
          <text class="section-title">完成进度</text>
          <textarea
            class="field-textarea"
            :value="detail.progress"
            disabled
            auto-height
          />
        </view>
        <view class="section-card">
          <text class="section-title">施工内容</text>
          <textarea
            class="field-textarea"
            :value="detail.content"
            disabled
            auto-height
          />
        </view>
      </view>

      <view v-else-if="activeSection === 'trades'" class="section-list">
        <view class="section-card">
          <text class="section-title">工种人员</text>
          <view class="trade-table">
            <view class="trade-row trade-row--head">
              <text class="trade-cell">工种</text>
              <text class="trade-cell trade-cell--count">数量</text>
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
          <text class="section-title">进场材料</text>
          <textarea
            class="field-textarea"
            :value="detail.materials"
            disabled
            auto-height
          />
        </view>
      </view>

      <view v-else-if="activeSection === 'plan'" class="section-list">
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
        title="施工照片"
        :files="detail.photos"
        empty-text="暂无施工照片"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import StatusCapsuleSwitch from '@/components/StatusCapsuleSwitch.vue';
import FileAttachmentCard from '@/components/FileAttachmentCard.vue';
import {
  DAILY_REPORT_TABS,
  useConstructionReports,
  type ConstructionReportItem,
  type DailyReportSection,
} from '@/composables/useConstructionReports';
import { usePageBack } from '@/composables/usePageBack';

const props = defineProps<{
  item: ConstructionReportItem;
}>();

const emit = defineEmits<{
  back: [];
}>();

const { getDailyDetail } = useConstructionReports();
const sectionTabs = DAILY_REPORT_TABS;
const activeSection = ref<DailyReportSection>('content');

const detail = computed(() => getDailyDetail(props.item.id));

const planCards = computed(() => [
  { title: '现场问题与解决', value: detail.value.issueResolution },
  { title: '次日施工内容', value: detail.value.nextDayContent },
  { title: '次日施工区域', value: detail.value.nextDayArea },
  { title: '次日人员安排', value: detail.value.nextDayStaff },
]);

watch(
  () => props.item.id,
  () => {
    activeSection.value = 'content';
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
