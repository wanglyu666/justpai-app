<template>
  <view class="feedback-list-page">
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
          placeholder="搜索反馈"
          placeholder-class="search-placeholder"
        />
      </view>
    </view>

    <view class="content">
      <view class="title-row">
        <view class="title-block">
          <text class="page-title">意见反馈</text>
          <text class="page-desc">查看全部意见反馈</text>
        </view>
        <view class="add-btn" @click="onAdd">
          <text class="add-btn-text">新增</text>
        </view>
      </view>

      <view class="feedback-list">
        <view
          v-for="item in filteredItems"
          :key="item.id"
          class="feedback-card"
          @click="openDetail(item)"
        >
          <view class="feedback-top">
            <text class="feedback-name">{{ item.name }}</text>
            <StatusBadge :status="item.status" :label="statusLabel(item.status)" />
          </view>

          <view class="feedback-field">
            <text class="field-label">反馈时间</text>
            <text class="field-value">{{ item.time }}</text>
          </view>
        </view>

        <view v-if="filteredItems.length === 0" class="empty-tip">
          <text class="empty-tip-text">暂无相关反馈</text>
        </view>
      </view>
    </view>

    <BottomSheetPanel
      :show="detailVisible"
      :z-index="2200"
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

        <view class="detail-content" v-if="selectedItem">
          <text class="detail-title">反馈详情</text>

          <view class="info-card">
            <view class="info-block">
              <text class="info-label">项目名称</text>
              <text class="info-value info-value-lg">{{ selectedItem.name }}</text>
            </view>
            <view class="info-divider" />
            <view class="info-meta-row">
              <view class="info-block info-block-grow">
                <text class="info-label">反馈时间</text>
                <text class="info-value">{{ selectedItem.time }}</text>
              </view>
              <view class="info-block info-block-status">
                <text class="info-label">状态</text>
                <StatusBadge :status="selectedItem.status" :label="statusLabel(selectedItem.status)" />
              </view>
            </view>
          </view>

          <view class="info-card">
            <view class="info-block">
              <text class="info-label">反馈内容</text>
              <text class="info-value info-value-body">{{ selectedItem.content }}</text>
            </view>

            <view class="info-divider" />

            <view class="info-block">
              <text class="info-label">反馈结果</text>
              <view v-if="selectedItem.result" class="result-box">
                <text class="info-value info-value-body">{{ selectedItem.result }}</text>
              </view>
              <text v-else class="result-empty">暂无反馈结果</text>
            </view>
          </view>

          <FileAttachmentCard :files="selectedItem.attachments" />
        </view>
      </view>
    </BottomSheetPanel>
    <BottomSheetPanel
      :show="formVisible"
      :z-index="2300"
      content-safe-top
      @closed="resetFormFlow"
    >
      <SuccessPageTransition :show-success="formStep === 'success'">
        <FeedbackFormContent
          ref="formRef"
          @back="closeForm"
          @submit="handleFormSubmit"
        />
        <template #success>
          <FeedbackSuccessContent @back="closeForm" />
        </template>
      </SuccessPageTransition>
    </BottomSheetPanel>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import BottomSheetPanel from '@/components/BottomSheetPanel.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import FileAttachmentCard from '@/components/FileAttachmentCard.vue';
import SuccessPageTransition from '@/components/SuccessPageTransition.vue';
import FeedbackFormContent from '@/components/FeedbackFormContent.vue';
import FeedbackSuccessContent from '@/components/FeedbackSuccessContent.vue';
import { useFeedbackItems, type FeedbackItem, type FeedbackStatus } from '@/composables/useFeedbackItems';
import { useSlideOver } from '@/composables/useSlideOver';
import { usePageBack, usePageBackWhen } from '@/composables/usePageBack';

const STATUS_LABEL: Record<FeedbackStatus, string> = {
  pending_reply: '待回复',
  in_progress: '进行中',
  closed: '已结束',
};

const emit = defineEmits<{
  back: [];
}>();

const keyword = ref('');
const selectedItem = ref<FeedbackItem | null>(null);
const formRef = ref<InstanceType<typeof FeedbackFormContent> | null>(null);
const formStep = ref<'form' | 'success'>('form');
const { items, addFeedback } = useFeedbackItems();
const {
  visible: detailVisible,
  open: openDetailPanel,
  close: closeDetail,
} = useSlideOver();
const {
  visible: formVisible,
  open: openFormPanel,
  close: closeFormPanel,
} = useSlideOver();
usePageBackWhen(detailVisible, closeDetail);

const filteredItems = computed(() => {
  const q = keyword.value.trim().toLowerCase();
  if (!q) return items.value;
  return items.value.filter((item) => {
    const statusText = STATUS_LABEL[item.status];
    return (
      item.name.toLowerCase().includes(q) ||
      item.time.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q) ||
      statusText.includes(q)
    );
  });
});

const statusLabel = (status: FeedbackStatus) => STATUS_LABEL[status];

const openDetail = (item: FeedbackItem) => {
  selectedItem.value = {
    ...item,
    attachments: [...item.attachments],
  };
  openDetailPanel();
};

const resetDetail = () => {
  selectedItem.value = null;
};

const handleBack = usePageBack(() => emit('back'));

const onAdd = () => {
  formStep.value = 'form';
  openFormPanel();
};

const closeForm = () => {
  closeFormPanel();
};

const resetFormFlow = () => {
  formStep.value = 'form';
  formRef.value?.resetForm();
};

const handleFormSubmit = (payload: {
  projectId: string;
  projectName: string;
  content: string;
  attachments: string[];
}) => {
  addFeedback({
    projectName: payload.projectName,
    content: payload.content,
    attachments: payload.attachments,
  });
  formStep.value = 'success';
};
</script>

<style scoped>
.feedback-list-page {
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

.add-btn {
  flex-shrink: 0;
  height: 88rpx;
  padding: 0 48rpx;
  border-radius: 28rpx;
  background-color: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-btn-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}

.feedback-list {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.feedback-card {
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 40rpx;
  padding: 40rpx 36rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.feedback-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24rpx;
}

.feedback-name {
  flex: 1;
  min-width: 0;
  font-size: 36rpx;
  font-weight: 800;
  color: #111827;
  line-height: 1.35;
}

.feedback-field {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.field-label {
  font-size: 24rpx;
  color: #9ca3af;
  line-height: 1.2;
}

.field-value {
  font-size: 30rpx;
  font-weight: 500;
  color: #111827;
  line-height: 1.45;
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
}

.detail-header {
  padding: 0 48rpx;
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

.info-block-grow {
  flex: 1;
  min-width: 0;
}

.info-block-status {
  flex-shrink: 0;
  align-items: flex-start;
}

.info-divider {
  height: 2rpx;
  background-color: #eef2f7;
  margin: 12rpx 0;
}

.info-meta-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 32rpx;
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

.result-box {
  margin-top: 4rpx;
  padding: 24rpx 28rpx;
  border-radius: 28rpx;
  background-color: #f8fafc;
  border: 2rpx solid #eef2f7;
  box-sizing: border-box;
}

.result-empty {
  font-size: 30rpx;
  font-weight: 500;
  color: #9ca3af;
  line-height: 1.55;
}
</style>
